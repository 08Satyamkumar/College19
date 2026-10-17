import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.SESSION_SECRET || "college19-super-secret-key-2026-secure-jwt";
export const AUTH_COOKIE_NAME = "college19_session";

export function verifyCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;

  const adminUser = process.env.ADMIN_USERNAME || "Samrat1311";
  const adminPass = process.env.ADMIN_PASSWORD || "1311161161";
  const writerUser = process.env.WRITER_USERNAME || "writer";
  const writerPass = process.env.WRITER_PASSWORD || "Writer2026";

  const isMatch =
    (username === adminUser && password === adminPass) ||
    (username.toLowerCase() === writerUser.toLowerCase() && password === writerPass);

  return isMatch;
}

export function createSessionToken(username: string): string {
  const payload = JSON.stringify({
    username,
    createdAt: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days validity
  });
  const b64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(b64Payload)
    .digest("base64url");

  return `${b64Payload}.${signature}`;
}

export function verifySessionToken(token?: string): { valid: boolean; username?: string } {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false };
  }

  const [b64Payload, signature] = token.split(".");
  if (!b64Payload || !signature) {
    return { valid: false };
  }

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(b64Payload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return { valid: false };
  }

  try {
    const jsonStr = Buffer.from(b64Payload, "base64url").toString("utf-8");
    const data = JSON.parse(jsonStr);

    if (data.exp && Date.now() > data.exp) {
      return { valid: false };
    }

    return { valid: true, username: data.username };
  } catch {
    return { valid: false };
  }
}

export async function isRequestAuthorized(
  request?: Request,
  bodyCredentials?: { username?: string; password?: string }
): Promise<boolean> {
  // 1. Check HttpOnly Session Cookie (Preferred & Secure)
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (sessionCookie) {
      const { valid } = verifySessionToken(sessionCookie);
      if (valid) return true;
    }
  } catch {
    // Cookie store may not be available in non-standard context
  }

  // 2. Check Authorization Header (Bearer token)
  if (request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const { valid } = verifySessionToken(token);
      if (valid) return true;
    }
  }

  // 3. Fallback for body credentials (verified safely against server env)
  if (bodyCredentials?.username && bodyCredentials?.password) {
    return verifyCredentials(bodyCredentials.username, bodyCredentials.password);
  }

  return false;
}
