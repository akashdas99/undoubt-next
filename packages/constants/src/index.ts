export const DB_POOL_MAX = 10;

export const ACCESS_COOKIE = "access_token";

export const QUESTION_TITLE_MAX_LENGTH = 255;
export const USER_NAME_MAX_LENGTH = 100;
export const USER_USERNAME_MAX_LENGTH = 32;

export const MIN_SECRET_LENGTH = 32;

export const RESET_TOKEN_LIFETIME_MINUTES = 5;
export const RESET_TOKEN_LIFETIME_MS =
  RESET_TOKEN_LIFETIME_MINUTES * 60 * 1000;

export const BCRYPT_COST = 10;

export const THROTTLE_WINDOW_MS = 60_000;
export const THROTTLE_DEFAULT_LIMIT = 30;
export const LOGIN_THROTTLE_LIMIT = 10;
export const SENSITIVE_THROTTLE_LIMIT = 5;