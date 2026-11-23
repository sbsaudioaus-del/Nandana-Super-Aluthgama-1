import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nandana-super-shop-ultra-secure-jwt-secret-2026-key";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const AUTH_COOKIE_NAME = "nandana_admin_session";

// Hashed admin credentials - default fallback matches 'Nandanasuper2026'
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  "$2b$10$5JxZqj11MeTtc5e7RLMtUukBfJklS9zTAjTN6GxhPOkqkFBB2Z3Be";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "Nandana Super";

/**
 * Validates admin credentials securely via bcrypt compare
 */
export async function verifyAdminCredentials(
  user: string,
  pass: string
): Promise<boolean> {
  if (user.trim() !== ADMIN_USERNAME.trim()) {
    return false;
  }
  return bcrypt.compare(pass, ADMIN_PASSWORD_HASH);
}

/**
 * Creates a signed JWT for the admin session
 */
export async function createAdminToken(username: string): Promise<string> {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

/**
 * Verifies JWT token
 */
export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Helper to check current admin session from incoming cookies
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
