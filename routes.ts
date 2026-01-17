/**
 * An Array of public routes that do not require authentication.
 * @type {string[]}
 */

export const publicRoutes = ["/", "/demo", "/auth/verify-email"];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /home
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/signup",'/auth/reset-password', "/auth/new-password"];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are handled by Auth.js. and used for Authentication.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are handled by Auth.js. and used for Authentication.
 * @type {string}
 */
export const baseURL = "http://localhost:3000";


/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/home";
