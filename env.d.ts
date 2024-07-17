declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    NEXTAUTH_SECRET: string;
    TURSO_DB_TOKEN: string;
    TURSO_DB_URL: string;
  }
}
