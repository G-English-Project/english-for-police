/** Dispatched to open the login dialog from `MainLayout` / `AuthDialogs`. */
export const OPEN_AUTH_LOGIN_EVENT = "police-english:open-auth-login";

export function requestOpenLoginDialog(): void {
  window.dispatchEvent(new CustomEvent(OPEN_AUTH_LOGIN_EVENT));
}
