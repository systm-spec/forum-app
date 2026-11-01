import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    nickname: string;
  }

  interface Session {
    user: { id: string; nickname: string };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    nickname?: string;
  }
}
