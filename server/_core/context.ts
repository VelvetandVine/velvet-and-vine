import { Request, Response } from "express";
import { getUserByOpenId } from "../db";
import { verifySessionCookie } from "./cookies";

export interface TrpcContext {
  user: Awaited<ReturnType<typeof getUserByOpenId>> | null;
  req: Request;
  res: Response;
}

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<TrpcContext> {
  let user = null;

  try {
    const sessionData = await verifySessionCookie(req);
    if (sessionData?.openId) {
      user = await getUserByOpenId(sessionData.openId);
    }
  } catch (error) {
    // Session verification failed, user remains null
  }

  return {
    user,
    req,
    res,
  };
}
