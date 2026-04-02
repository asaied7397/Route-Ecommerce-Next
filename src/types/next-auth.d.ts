import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      phone?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    accessToken?: string;
    role?: string;
    phone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    role?: string;
    phone?: string | null;
  }
}
