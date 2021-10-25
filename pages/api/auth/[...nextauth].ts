import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import prisma from "../../../lib/prisma";
import { Session, verifyPassword } from "../../../lib/auth";

export default NextAuth({
  session: {
    jwt: true,
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/logout",
    error: "/auth/signin", // Error code passed in query string as ?error=
  },
  providers: [
    Providers.Credentials({
      name: "Couchforms",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "lisa@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your super secure password",
        },
      },
      async authorize(credentials: any) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }
        if (!user.password) {
          throw new Error("Incorrect password");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session, token) {
      const newSession: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.id as number,
        },
      };
      return newSession;
    },
  },
});
