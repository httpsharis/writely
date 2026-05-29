import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // 1. NextAuth injects the token into the request if the user is logged in
    const isAuth = !!req.nextauth.token;
    const isLoginPage = req.nextUrl.pathname === "/login";

    // 2. If a LOGGED IN user tries to visit the login page, kick them to the dashboard
    if (isLoginPage && isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // 3. This determines IF the user is allowed to proceed
      authorized: ({ req, token }) => {
        // If an unauthenticated user is trying to access the login page, let them in!
        if (req.nextUrl.pathname === "/login") {
          return true;
        }
        // For every other route, they MUST have a valid token to enter
        return !!token;
      },
    },
    // 4. CRITICAL: Tells NextAuth where your custom login page lives
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  // 5. THE FIX: Use an explicit inclusion list to avoid Next.js Turbopack regex parsing bugs that block API routes
  matcher: ["/", "/login", "/library", "/write", "/project/:path*"],
};