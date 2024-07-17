import "next-auth/jwt";
import type { DiscordProfile } from "next-auth/providers/discord";

declare module "next-auth/jwt" {
  interface JWT {
    profile: DiscordProfile;
    accessToken: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: DiscordProfile;
  }
}
