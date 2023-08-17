// export { default } from "next-auth/middleware";
// to secure admin page and all sub routes

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname === "/admin" &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    } else if (
      req.nextUrl.pathname !== "/admin" &&
      req.nextauth.token?.role === "admin"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    } else if (!req.nextauth.token) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin", "/order", "/referral", "/profile", "/history", "/funds"],
};
