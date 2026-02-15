import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb-client";

export const authOptions: NextAuthOptions = {
  // 1. MongoDB adapter — persists user accounts & OAuth links in MongoDB.
  //    Combined with JWT strategy so session tokens live in a browser cookie
  //    (no DB lookup on every request) while account data stays in the DB.
  adapter: MongoDBAdapter(clientPromise),

  // 2. Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  // 3. JWT sessions — token lives in a secure httpOnly cookie.
  //    Survives browser restarts; no server-side session lookup needed.
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  // 4. Secret for signing & encrypting the JWT cookie
  secret: process.env.NEXTAUTH_SECRET,

  // 5. Callbacks
  callbacks: {
    // Persist user id + email into the JWT on sign-in
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    // Expose id + email on the client-side session object
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};