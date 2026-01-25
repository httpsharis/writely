import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // 1. Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  
  // 2. Secret for securing the session
  secret: process.env.NEXTAUTH_SECRET,
  
  // 3. Optional: Custom pages (we will add this later, leave commented for now)
  // pages: {
  //   signIn: '/login',
  // },
};