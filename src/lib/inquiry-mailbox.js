import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import {
  imapConfiguration,
  INQUIRY_ATTACHMENT,
  INQUIRY_HEADER,
  INQUIRY_RECIPIENT,
} from "./inquiry-mail.js";

export class MailboxChangedError extends Error {}
export class InquiryNotFoundError extends Error {}
const marker = INQUIRY_HEADER.toLowerCase();
const maxMessageSize = 150000;
export function mailboxId(validity, uid) {
  return `${String(validity)}:${uid}`;
}
export function parseMailboxId(id, validity) {
  const match = /^(\d{1,20}):(\d{1,10})$/.exec(String(id));
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 0xffffffff)
    throw new InquiryNotFoundError("문의를 찾을 수 없습니다.");
  if (match[1] !== String(validity))
    throw new MailboxChangedError(
      "메일함 정보가 변경되었습니다. 목록을 새로고침해 주세요.",
    );
  return Number(match[2]);
}
export async function parseInquiryEmail(
  source,
  { uid, validity, flags = new Set(), date } = {},
) {
  const parsed = await simpleParser(source, {
    skipHtmlToText: true,
    skipTextToHtml: true,
    skipImageLinks: true,
  });
  if (parsed.headers.get(marker) !== "v1") return null;
  if (
    !parsed.to?.value?.some(
      (address) => address.address?.toLowerCase() === INQUIRY_RECIPIENT,
    )
  )
    return null;
  const attachment = parsed.attachments.find(
    (a) => a.filename === INQUIRY_ATTACHMENT && a.content.length <= 32768,
  );
  if (!attachment) return null;
  let r;
  try {
    r = JSON.parse(attachment.content.toString("utf8"));
  } catch {
    return null;
  }
  if (
    !r ||
    typeof r !== "object" ||
    Array.isArray(r) ||
    r.version !== 1 ||
    typeof r.id !== "string" ||
    !/^[a-f\d-]{36}$/i.test(r.id) ||
    typeof r.name !== "string" ||
    typeof r.message !== "string"
  )
    return null;
  const str = (v, max) => (typeof v === "string" ? v.slice(0, max) : "");
  const arr = (v) =>
    Array.isArray(v) ? v.slice(0, 10).map((x) => str(x, 100)) : [];
  return {
    id: mailboxId(validity, uid),
    recordId: r.id,
    name: str(r.name, 100),
    email: str(r.email, 254),
    phone: str(r.phone, 40),
    company: str(r.company, 200),
    position: str(r.position, 100),
    url: str(r.url, 1000),
    message: str(r.message, 10000),
    services: arr(r.services),
    budget: arr(r.budget),
    created_at: date
      ? new Date(date).toISOString()
      : Number.isFinite(Date.parse(r.created_at))
        ? new Date(r.created_at).toISOString()
        : new Date(0).toISOString(),
    completed: flags.has("\\Flagged"),
  };
}
async function withInbox(
  task,
  write = false,
  createClient = (config) => new ImapFlow(config),
) {
  const client = createClient(imapConfiguration());
  client.on?.("error", () => {});
  let lock;
  try {
    await client.connect();
    lock = await client.getMailboxLock("INBOX", { readOnly: !write });
    return await task(client, String(client.mailbox.uidValidity));
  } finally {
    lock?.release();
    try {
      await client.logout();
    } catch {
      client.close();
    }
  }
}
export async function listMailInquiries({
  before,
  limit = 30,
  createClient,
} = {}) {
  return withInbox(
    async (client, validity) => {
      let uids = await client.search(
        { header: { [INQUIRY_HEADER]: "v1" } },
        { uid: true },
      );
      uids = (uids || [])
        .filter((uid) => !before || uid < before)
        .sort((a, b) => b - a);
      const selected = uids.slice(0, limit),
        hasMore = uids.length > limit;
      if (!selected.length)
        return { inquiries: [], hasMore: false, nextCursor: null };
      const headers = await client.fetchAll(
        selected,
        { uid: true, size: true },
        { uid: true },
      );
      const allowed = headers
        .filter((m) => m.size <= maxMessageSize)
        .map((m) => m.uid);
      const messages = allowed.length
        ? await client.fetchAll(
            allowed,
            { uid: true, source: true, flags: true, internalDate: true },
            { uid: true },
          )
        : [];
      const inquiries = [];
      for (const message of messages) {
        const inquiry = await parseInquiryEmail(message.source, {
          uid: message.uid,
          validity,
          flags: message.flags,
          date: message.internalDate,
        });
        if (inquiry) inquiries.push(inquiry);
      }
      inquiries.sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
      );
      return {
        inquiries,
        hasMore,
        nextCursor: hasMore ? Math.min(...selected) : null,
      };
    },
    false,
    createClient,
  );
}
export async function changeMailInquiry(
  id,
  { completed, archive = false },
  createClient,
) {
  return withInbox(
    async (client, validity) => {
      const uid = parseMailboxId(id, validity);
      const info = await client.fetchOne(
        String(uid),
        { uid: true, size: true },
        { uid: true },
      );
      if (!info || info.size > maxMessageSize)
        throw new InquiryNotFoundError("문의를 찾을 수 없습니다.");
      const message = await client.fetchOne(
        String(uid),
        { uid: true, source: true, flags: true },
        { uid: true },
      );
      if (
        !message ||
        !(await parseInquiryEmail(message.source, {
          uid,
          validity,
          flags: message.flags,
        }))
      )
        throw new InquiryNotFoundError("문의를 찾을 수 없습니다.");
      if (archive) {
        const folder = "NUVIO-Inquiries-Archive";
        const mailboxes = await client.list();
        if (!mailboxes.some((m) => m.path === folder))
          await client.mailboxCreate(folder);
        if (!(await client.messageMove(uid, folder, { uid: true })))
          throw new Error("보관하지 못했습니다.");
      } else {
        const method = completed ? "messageFlagsAdd" : "messageFlagsRemove";
        if (!(await client[method](uid, ["\\Flagged"], { uid: true })))
          throw new Error("상태를 변경하지 못했습니다.");
      }
      return { ok: true };
    },
    true,
    createClient,
  );
}
