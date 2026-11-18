export const authEndpoints = {
  session: "/auth/session",
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
} as const;
