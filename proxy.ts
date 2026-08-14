import { clerkMiddleware } from "@clerk/nextjs/server";

// Define array of public path prefixes
const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/public",
  "/api/public"
];

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Check if current request path starts with any of the public path prefixes
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!isPublic) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webp|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};