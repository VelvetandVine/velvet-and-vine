export const ENV = {
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  appId: process.env.VITE_APP_ID || "",
  oauthServerUrl: process.env.OAUTH_SERVER_URL || "https://api.manus.im",
  oauthPortalUrl: process.env.VITE_OAUTH_PORTAL_URL || "https://oauth.manus.im",
  ownerOpenId: process.env.OWNER_OPEN_ID || "",
  ownerName: process.env.OWNER_NAME || "",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL || "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY || "",
};
