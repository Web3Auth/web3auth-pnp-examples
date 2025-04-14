import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface User {
    idToken?: string;
  }
  interface Session {
    idToken?: string | undefined;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: "openid profile email",
          session: {
            strategy: "jwt",
          },
        },
      },
    }),
  ],
  callbacks: {
    // get the idToken
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.idToken = token.idToken as string;
      return session;
    },
  },
});
