import test from "node:test";
import assert from "node:assert/strict";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import {
  normalizeInquiry,
  inquiryMailOptions,
  deliverInquiry,
  imapConfiguration,
  INQUIRY_RECIPIENT,
} from "../src/lib/inquiry-mail.js";
import {
  parseInquiryEmail,
  parseMailboxId,
  changeMailInquiry,
  listMailInquiries,
} from "../src/lib/inquiry-mailbox.js";
import {
  generateSessionToken,
  verifySessionToken,
  verifyAdminPassword,
} from "../src/lib/admin-session.js";
const input = {
  name: "테스트",
  email: "test@example.com",
  message: "<script>안녕</script>\n다음 줄",
  consent: true,
};
const env = {
  ADMIN_PASSWORD: "test-password-only",
  SESSION_SECRET: "s".repeat(40),
};
const mime = async (options) => new MailComposer(options).compile().build();
test("signed admin sessions reject forged, changed, future and expired tokens", () => {
  const token = generateSessionToken(env, 1000);
  assert.equal(verifySessionToken(token, env, 1001), true);
  for (const [t, at] of [
    [token + "x", 1001],
    [token, 999],
    [token, 86401000],
    [Buffer.from("admin:1000").toString("base64"), 1001],
  ])
    assert.equal(verifySessionToken(t, env, at), false);
  assert.equal(verifySessionToken(token, {}, 1001), false);
  assert.equal(verifyAdminPassword(env.ADMIN_PASSWORD, env), true);
  assert.equal(verifyAdminPassword("incorrect", env), false);
});
test("validation requires contact and explicit consent; bounds header and list values", () => {
  for (const value of [
    null,
    [],
    {},
    { ...input, consent: false },
    { ...input, email: "bad" },
    { ...input, websiteTrap: "spam" },
  ])
    assert.throws(() => normalizeInquiry(value));
  const record = normalizeInquiry({
    ...input,
    name: "name\r\nBcc: other",
    services: Array(20).fill("service"),
  });
  assert.equal(/[\r\n]/.test(record.name), false);
  assert.equal(record.services.length, 10);
  assert.equal(
    normalizeInquiry({ ...input, email: "", phone: "010-1234-5678" }).phone,
    "010-1234-5678",
  );
});
test("real MIME round trip preserves Korean inquiry data and escapes email HTML", async () => {
  const record = normalizeInquiry(input),
    options = inquiryMailOptions(record, INQUIRY_RECIPIENT);
  assert.ok(!options.html.includes("<script>"));
  const parsed = await parseInquiryEmail(await mime(options), {
    uid: 7,
    validity: 123,
    flags: new Set(["\\Flagged"]),
  });
  assert.equal(parsed.message, input.message);
  assert.equal(parsed.name, input.name);
  assert.equal(parsed.id, "123:7");
  assert.equal(parsed.completed, true);
  assert.equal(
    await parseInquiryEmail(
      await mime({
        from: INQUIRY_RECIPIENT,
        to: INQUIRY_RECIPIENT,
        text: "unrelated",
      }),
    ),
    null,
  );
  const malformed = {
    ...options,
    attachments: [{ filename: "nuvio-inquiry.json", content: "null" }],
  };
  assert.equal(await parseInquiryEmail(await mime(malformed)), null);
});
test("SMTP success requires recipient acceptance and always closes connection", async () => {
  for (const accepted of [[], [INQUIRY_RECIPIENT]]) {
    let closed = false;
    const call = deliverInquiry(
      normalizeInquiry(input),
      { auth: { user: INQUIRY_RECIPIENT } },
      () => ({
        sendMail: async () => ({ accepted }),
        close: () => {
          closed = true;
        },
      }),
    );
    if (accepted.length) assert.equal((await call).emailSent, true);
    else await assert.rejects(call);
    assert.equal(closed, true);
  }
  let closed = false;
  await assert.rejects(
    deliverInquiry(
      normalizeInquiry(input),
      { auth: { user: INQUIRY_RECIPIENT } },
      () => ({
        sendMail: async () => {
          throw new Error("offline");
        },
        close: () => {
          closed = true;
        },
      }),
    ),
  );
  assert.equal(closed, true);
});
test("mailbox IDs reject stale validity and invalid UID values", () => {
  assert.equal(parseMailboxId("123:7", 123), 7);
  for (const id of ["123:0", "123:4294967296", "124:7", "7", "a:7"])
    assert.throws(() => parseMailboxId(id, 123));
});
test("mailbox uses Gmail TLS settings and existing app password", () => {
  const config = imapConfiguration({
    SMTP_PASS: "test-only",
    SMTP_USER: INQUIRY_RECIPIENT,
  });
  assert.equal(config.host, "imap.gmail.com");
  assert.equal(config.port, 993);
  assert.equal(config.auth.pass, "test-only");
});
test("mailbox mutations reject unrelated messages and release the lock", async () => {
  process.env.IMAP_PASS = "offline-test-only";
  let released = false,
    mutated = false;
  const source = await mime({
    from: INQUIRY_RECIPIENT,
    to: INQUIRY_RECIPIENT,
    text: "unrelated",
  });
  const createClient = () => ({
    mailbox: { uidValidity: 123 },
    connect: async () => {},
    getMailboxLock: async () => ({
      release: () => {
        released = true;
      },
    }),
    logout: async () => {},
    fetchOne: async (_, query) =>
      query.source ? { source, flags: new Set() } : { size: 100 },
    messageFlagsAdd: async () => {
      mutated = true;
    },
  });
  try {
    await assert.rejects(
      changeMailInquiry("123:7", { completed: true }, createClient),
    );
    assert.equal(mutated, false);
    assert.equal(released, true);
  } finally {
    delete process.env.IMAP_PASS;
  }
});
test("mailbox connection errors propagate instead of showing an empty inbox", async () => {
  process.env.IMAP_PASS = "offline-test-only";
  try {
    await assert.rejects(
      listMailInquiries({
        createClient: () => ({
          connect: async () => {
            throw new Error("offline");
          },
          logout: async () => {},
        }),
      }),
      /offline/,
    );
  } finally {
    delete process.env.IMAP_PASS;
  }
});
