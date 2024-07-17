import { cookies } from "next/headers";

import type { AuthOptions } from "next-auth";
import type { DiscordProfile } from "next-auth/providers/discord";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
    }),
  ],
  callbacks: {
    async jwt({ token, profile, account }) {
      const cookie = cookies();

      if (account?.access_token) {
        token.profile = profile as DiscordProfile;
        token.accessToken = account.access_token;
        cookie.set("access_token", account.access_token, {
          expires: account.expires_at,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.profile;
      return session;
    },
  },
};
