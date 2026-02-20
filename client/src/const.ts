export function getLoginUrl(returnPath?: string) {
  const state = JSON.stringify({
    origin: window.location.origin,
    returnPath: returnPath || "/",
  });
  const encodedState = btoa(state);
  const oauthPortalUrl = (import.meta as any).env.VITE_OAUTH_PORTAL_URL || "https://oauth.manus.im";
  const appId = (import.meta as any).env.VITE_APP_ID;
  return `${oauthPortalUrl}/authorize?app_id=${appId}&state=${encodedState}`;
}
