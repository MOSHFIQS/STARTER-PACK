import { CookieOptions } from 'express';

/**
 * Centralised cookie configuration for production-grade HttpOnly cookies.
 *
 * The backend owns the auth token and sets it as an HttpOnly cookie so it is
 * never exposed to client-side JavaScript. This prevents XSS token theft.
 *
 * In production the frontend (Vercel) and backend (Railway) are different sites,
 * so cookies must use SameSite=None; Secure to be sent on credentialed API calls.
 */
export function getCookieOptions(
     isProd: boolean,
     overrides?: Partial<CookieOptions>,
): CookieOptions {
     return {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
          // App-wide path keeps the browser session consistent across frontend routes.
          path: '/',
          ...overrides,
     };
}

/**
 * Auth token cookie (single-token auth: 7 days)
 */
export function authTokenCookieOptions(isProd: boolean): CookieOptions {
     return getCookieOptions(isProd, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
     });
}

/**
 * Cookie names used across the auth system
 */
export const COOKIE_NAMES = {
     AUTH_TOKEN: 'authToken',
} as const;
