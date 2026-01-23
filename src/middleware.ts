import { authConfig } from "./server/auth/config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  onboardingRoutes,
} from "routes";
import { type NextAuthRequest } from "node_modules/next-auth/lib";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request: NextAuthRequest) {
  // Your custom middleware logic goes here
  const { nextUrl } = request;
  const isLoggedIn = !!request.auth;

  const isAPIAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isEventDetailRoute = /^\/event\/[^/]+$/.test(nextUrl.pathname);
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) || isEventDetailRoute;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isOnboardingRoute = onboardingRoutes.includes(nextUrl.pathname);

  if (isAPIAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (isOnboardingRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
