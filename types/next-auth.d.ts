import NextAuth, { DefaultSession } from "next-auth";

// This tells TypeScript: "Hey, take the default NextAuth Session, and forcefully add 'id' to the user object."
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}