import { NextResponse } from "next/server";
import {
  withMiddlewareAuthRequired,
  getSession,
} from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired(async (req) => {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  if (!session) {
    return NextResponse.redirect("/api/auth/login");
  }

  // บันทึกข้อมูลผู้ใช้ใหม่
  await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: session.user.email,
      name: session.user.name,
    }),
  });

  req.user = session.user;
  return res;
});

export const config = {
  matcher: ["/profile", "/board"],
};
