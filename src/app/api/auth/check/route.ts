import { NextResponse } from "next/server";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET(request: Request) {
  const isAuth = await isRequestAuthorized(request);
  return NextResponse.json({
    isAuthenticated: isAuth,
  });
}
