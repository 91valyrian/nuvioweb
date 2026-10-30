import {
  createHmac,
  randomBytes,
  timingSafeEqual,
  createHash,
} from "node:crypto";
export const SESSION_COOKIE_NAME = "admin_session";
const lifetime = 24 * 60 * 60 * 1000;
function configuration(env = process.env) {
  if (
    !env.ADMIN_PASSWORD ||
    env.ADMIN_PASSWORD.length < 12 ||
    !env.SESSION_SECRET ||
    env.SESSION_SECRET.length < 32
  )
    throw new Error("관리자 인증 설정이 필요합니다.");
  return { password: env.ADMIN_PASSWORD, secret: env.SESSION_SECRET };
}
export function verifyAdminPassword(password, env = process.env) {
  const c = configuration(env);
  const digest = (s) => createHash("sha256").update(String(s)).digest();
  return timingSafeEqual(digest(password), digest(c.password));
}
export function generateSessionToken(env = process.env, now = Date.now()) {
  const { secret } = configuration(env);
  const payload = Buffer.from(
    JSON.stringify({
      iat: now,
      exp: now + lifetime,
      nonce: randomBytes(16).toString("hex"),
    }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}
export function verifySessionToken(token, env = process.env, now = Date.now()) {
  try {
    const { secret } = configuration(env);
    if (typeof token !== "string" || token.length > 1000) return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payload, signature] = parts,
      expected = createHmac("sha256", secret).update(payload).digest();
    const received = Buffer.from(signature, "base64url");
    if (
      received.length !== expected.length ||
      !timingSafeEqual(received, expected)
    )
      return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return (
      Number.isFinite(data.iat) &&
      Number.isFinite(data.exp) &&
      data.iat <= now &&
      data.iat >= now - lifetime &&
      data.exp > now &&
      data.exp === data.iat + lifetime
    );
  } catch {
    return false;
  }
}
export function sameOriginRequest(req) {
  const origin = req.headers.get("origin");
  return !origin || origin === new URL(req.url).origin;
}
