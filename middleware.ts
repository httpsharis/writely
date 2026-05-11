import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// This acts as our bouncer. It checks if the user has a valid session.
export default withAuth(
    function middleware(req) {
        if (req.nextUrl.pathname === "/login") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
)

// Here we tell the bouncer WHICH rooms to protect.
export const config = {
    // Protects the root page (/) and everything else, BUT ignores /login, /api, and static files
    matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};