import test from "node:test";
import assert from "node:assert/strict";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import {
  normalizeInquiry,
  inquiryMailOptions,
  deliverInquiry,
  imapConfiguration,
  INQUIRY_RECIPIENT,
  INQUIRY_AUTO_STAR_HEADER,
  INQUIRY_LABEL,
  INQUIRY_COMPLETED_LABEL,
} from "../src/lib/inquiry-mail.js";
import {
  parseInquiryEmail,
  classifyInquiryMail,
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
  assert.equal(parsed.completed, false);
  assert.equal(parsed.autoStarred, true);
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

test("automatic stars are independent of completion; old messages keep their existing status", async () => {
  const options = inquiryMailOptions(
    normalizeInquiry(input),
    INQUIRY_RECIPIENT,
  );
  const source = await mime(options);
  assert.equal(
    (await parseInquiryEmail(source, { flags: new Set(["\\Flagged"]) }))
      .completed,
    false,
  );
  assert.equal(
    (
      await parseInquiryEmail(source, {
        labels: new Set([INQUIRY_COMPLETED_LABEL]),
      })
    ).completed,
    true,
  );
  const legacy = { ...options, headers: { "X-Nuvio-Inquiry": "v1" } };
  assert.equal(
    (
      await parseInquiryEmail(await mime(legacy), {
        flags: new Set(["\\Flagged"]),
      })
    ).completed,
    true,
  );
  assert.equal(options.from, INQUIRY_RECIPIENT);
  assert.equal(options.priority, "high");
  assert.equal(options.headers[INQUIRY_AUTO_STAR_HEADER], "v1");
});

function fakeInquiryMailbox(source, { delayed = false } = {}) {
  const changes = [],
    queries = [];
  let attempts = 0,
    released = false,
    loggedOut = false;
  const folders = [];
  const client = {
    capabilities: new Set(["X-GM-EXT-1"]),
    mailbox: { uidValidity: 123 },
    connect: async () => {},
    noop: async () => {},
    getMailboxLock: async () => ({
      release: () => {
        released = true;
      },
    }),
    logout: async () => {
      loggedOut = true;
    },
    list: async () => folders,
    mailboxCreate: async (name) => {
      folders.push({ path: name });
    },
    search: async (query) => {
      queries.push(query);
      return delayed && attempts++ === 0 ? [] : [7];
    },
    fetchOne: async (_, query) =>
      query.source
        ? { source, flags: new Set(["\\Flagged"]), labels: new Set() }
        : { size: 100 },
    messageFlagsAdd: async (...args) => {
      changes.push(["add", ...args]);
      return true;
    },
    messageFlagsRemove: async (...args) => {
      changes.push(["remove", ...args]);
      return true;
    },
  };
  return {
    client,
    changes,
    queries,
    folders,
    cleaned: () => released && loggedOut,
  };
}

test("classification applies label, Important and star only to the delivered inquiry, with delayed arrival retry", async () => {
  process.env.IMAP_PASS = "offline-test-only";
  try {
    const record = normalizeInquiry(input);
    const mock = fakeInquiryMailbox(
      await mime(inquiryMailOptions(record, INQUIRY_RECIPIENT)),
      { delayed: true },
    );
    await classifyInquiryMail(record, {
      createClient: () => mock.client,
      wait: async () => {},
    });
    assert.equal(mock.queries.length, 2);
    assert.equal(
      mock.queries[0].header["Message-ID"],
      `<${record.id}@nuvio-web.com>`,
    );
    assert.deepEqual(mock.changes, [
      [
        "add",
        7,
        [INQUIRY_LABEL, "\\Important"],
        { uid: true, useLabels: true },
      ],
      ["add", 7, ["\\Flagged"], { uid: true }],
    ]);
    assert.ok(mock.folders.some((folder) => folder.path === INQUIRY_LABEL));
    assert.equal(mock.cleaned(), true);
  } finally {
    delete process.env.IMAP_PASS;
  }
});

test("classification rejects an unrelated mail or different inquiry without changing its labels", async () => {
  process.env.IMAP_PASS = "offline-test-only";
  try {
    const record = normalizeInquiry(input);
    for (const source of [
      await mime({ text: "unrelated" }),
      await mime(
        inquiryMailOptions(normalizeInquiry(input), INQUIRY_RECIPIENT),
      ),
    ]) {
      const mock = fakeInquiryMailbox(source);
      await assert.rejects(
        classifyInquiryMail(record, {
          createClient: () => mock.client,
          wait: async () => {},
        }),
      );
      assert.equal(mock.changes.length, 0);
      assert.equal(mock.cleaned(), true);
    }
  } finally {
    delete process.env.IMAP_PASS;
  }
});

test("completing and reopening new inquiries changes only the completion label and preserves their stars", async () => {
  process.env.IMAP_PASS = "offline-test-only";
  try {
    const source = await mime(
      inquiryMailOptions(normalizeInquiry(input), INQUIRY_RECIPIENT),
    );
    for (const completed of [true, false]) {
      const mock = fakeInquiryMailbox(source);
      await changeMailInquiry("123:7", { completed }, () => mock.client);
      assert.deepEqual(mock.changes, [
        [
          completed ? "add" : "remove",
          7,
          [INQUIRY_COMPLETED_LABEL],
          { uid: true, useLabels: true },
        ],
      ]);
      assert.equal(mock.cleaned(), true);
    }
  } finally {
    delete process.env.IMAP_PASS;
  }
});
