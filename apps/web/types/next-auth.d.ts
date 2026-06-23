import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      discordId?: string;
      isAuthorized?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    discordId?: string;
    isAuthorized?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
    isAuthorized?: boolean;
  }
}
