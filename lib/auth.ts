import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Validation for the ENV key
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`MISSING ENV VARIABLE: ${key}`)
  }
  return value
}

export const authOptions: NextAuthOptions = {
  // 1. PROVIDERS: The services users can use to log in
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  // 3. SESSION STRATEGY: JWT for speed
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  // 4. SECURITY: Key used to encrypt the JWT
  secret: getEnv("NEXTAUTH_SECRET"),

  // 5. CUSTOM PAGES: Tell NextAuth to use our custom login page
  pages: {
    signIn: "/login",
  },

  // 6. CALLBACKS: Customize what data is available in the session
  callbacks: {
    // Persist user id + email into the JWT on sign-in
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id?.toString();
        token.email = user.email;
      }
      return token;
    },
    // Expose id + email on the client-side session object
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Add debug mode to see exact errors in the VS Code terminal
  debug: true,
};