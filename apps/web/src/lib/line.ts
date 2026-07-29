import liff from "@line/liff";
import { createMetaReviewSession, setDevelopmentLineUser, setLineIdentityToken, setMetaReviewSession } from "../api/client";

const developmentUserID = "local-development-user";
const metaReviewSessionKey = "linora.meta-review-session";

export type IdentityMode = "development" | "line" | "meta-review";

export function isMetaReviewPath() {
  return window.location.pathname === "/meta-review";
}

export async function initializeLineIdentity(): Promise<IdentityMode | null> {
  const storedReviewSession = window.sessionStorage.getItem(metaReviewSessionKey);
  if (isMetaReviewPath() || storedReviewSession) {
    const params = new URLSearchParams(window.location.search);
    let session = storedReviewSession;
    const accessToken = params.get("token");
    if (accessToken) {
      session = await createMetaReviewSession(accessToken);
      window.sessionStorage.setItem(metaReviewSessionKey, session);
      window.history.replaceState({}, document.title, "/meta-review");
    }
    if (!session) {
      if (isMetaReviewPath()) throw new Error("Meta review link is missing or has expired.");
    } else {
      setMetaReviewSession(session);
      return "meta-review";
    }
  }

  const liffID = import.meta.env.VITE_LIFF_ID?.trim();
  if (!liffID) {
    setDevelopmentLineUser(developmentUserID);
    return "development";
  }

  await liff.init({ liffId: liffID, withLoginOnExternalBrowser: true });
  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: window.location.href });
    return null;
  }

  const idToken = liff.getIDToken();
  if (!idToken) {
    throw new Error("LINE identity token is unavailable");
  }
  setLineIdentityToken(idToken);
  return "line";
}
