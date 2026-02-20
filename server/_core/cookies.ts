import { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAME } from "@shared/const";
import { ENV } from "./env";

const secret = new TextEncoder().encode(ENV.jwtSecret);

export interface SessionData {
  openId: string;
  iat?: number;
  exp?: number;
}

export function getSessionCookieOptions(req: Request) {
  const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: "none" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

export async function createSessionCookie(openId: string): Promise<string> {
  const token = await new SignJWT({ openId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return token;
}

export async function verifySessionCookie(req: Request): Promise<SessionData | null> {
  const cookie = req.cookies[COOKIE_NAME];
  if (!cookie) return null;

  try {
    const verified = await jwtVerify(cookie, secret);
    return verified.payload as SessionData;
  } catch (error) {
    return null;
  }
}
