import { requestOpenLoginDialog } from "@/lib/auth-ui-events";
import type { User } from "@/models/user.model";
import { toast } from "sonner";

export const AUTH_SESSION_CHANGED_EVENT = "auth-changed";

const STORAGE_NAMESPACE = "english-for-police";
const AUTH_TOKEN_KEY = `${STORAGE_NAMESPACE}:session`;
const AUTH_USER_KEY = `${STORAGE_NAMESPACE}:user`;

/** Legacy keys from an older login implementation — migrated on read, cleared on logout. */
const LEGACY_AUTH_TOKEN_KEY = "auth_token";
const LEGACY_AUTH_USER_KEY = "auth_user";

const DEFAULT_EXPIRY_LEEWAY_SECONDS = 30;

let handlingUnauthorized = false;

function migrateLegacyAuthStorage(): void {
  const legacyToken = localStorage.getItem(LEGACY_AUTH_TOKEN_KEY);
  if (legacyToken && !localStorage.getItem(AUTH_TOKEN_KEY)) {
    localStorage.setItem(AUTH_TOKEN_KEY, legacyToken);
  }
  const legacyUser = localStorage.getItem(LEGACY_AUTH_USER_KEY);
  if (legacyUser && !localStorage.getItem(AUTH_USER_KEY)) {
    localStorage.setItem(AUTH_USER_KEY, legacyUser);
  }
}

export function getAuthToken(): string | null {
  migrateLegacyAuthStorage();
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredAuthUserRaw(): string | null {
  migrateLegacyAuthStorage();
  return localStorage.getItem(AUTH_USER_KEY);
}

export function getStoredAuthUser(): User | null {
  const raw = getStoredAuthUserRaw();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: User): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_USER_KEY);
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_USER_KEY);
}

function parseJwtPayload(token: string): { exp?: number } | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;

    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded)) as { exp?: number };
  } catch {
    return null;
  }
}

export function isJwtExpired(
  token: string,
  leewaySeconds: number = DEFAULT_EXPIRY_LEEWAY_SECONDS,
): boolean {
  const payload = parseJwtPayload(token);
  if (payload?.exp == null || Number.isNaN(payload.exp)) {
    return false;
  }
  const expiresAtMs = payload.exp * 1000;
  return Date.now() >= expiresAtMs - leewaySeconds * 1000;
}

export function assertValidAuthToken(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  if (isJwtExpired(token)) {
    handleUnauthorizedSession({ reason: "expired" });
    return false;
  }

  return true;
}

export function isAuthApiEndpoint(endpoint: string): boolean {
  const path = endpoint.split("?")[0];
  return (
    path.endsWith("/api/v1/auth/login") ||
    path.endsWith("/api/v1/auth/register")
  );
}

export function shouldHandleUnauthorizedApi(
  endpoint: string,
  status: number,
): boolean {
  if (status !== 401) return false;
  if (isAuthApiEndpoint(endpoint)) return false;
  return !!getAuthToken() || !!getStoredAuthUserRaw();
}

export interface HandleUnauthorizedOptions {
  reason?: "expired" | "api";
  silent?: boolean;
}

export function handleUnauthorizedSession(
  options: HandleUnauthorizedOptions = {},
): void {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;

  const hadSession = !!getAuthToken() || !!getStoredAuthUserRaw();
  clearAuthSession();

  if (hadSession) {
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));

    if (!options.silent) {
      const title =
        options.reason === "expired"
          ? "Phiên đăng nhập đã hết hạn"
          : "Phiên đăng nhập không còn hợp lệ";
      toast.warning(title, {
        description: "Vui lòng đăng nhập lại để tiếp tục.",
        position: "bottom-right",
      });
      requestOpenLoginDialog();
    }
  }

  window.setTimeout(() => {
    handlingUnauthorized = false;
  }, 800);
}
