import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type SignInApiResponse = {
  message?: string;
  token?: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
    id?: string;
  };
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/auth/signin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
          },
        );

        const data: SignInApiResponse = await res.json();

        if (!res.ok || !data?.token) {
          return null;
        }

        return {
          id: data.user?.id ?? "",
          name: data.user?.name ?? "",
          email: data.user?.email ?? email,
          accessToken: data.token,
          role: data.user?.role ?? "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.role = token.role ?? "";
      }

      session.accessToken = token.accessToken || "";
      return session;
    },
  },
};
