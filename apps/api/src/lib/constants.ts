/** Postgres SQLSTATE for unique_violation. */
export const UNIQUE_VIOLATION = '23505';
export const LEGACY_REFRESH_COOKIE = 'refresh_token';
export const ACCESS_MAX_AGE_SECONDS = 15 * 60;
export const ACCESS_TTL = '15m';

export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
export const LOGIN_REQUIRED_MESSAGE = 'You must be logged in';

export const REGISTER_UNIQUE_COLUMNS = {
  user_name: 'userName',
  email: 'email',
};

export const REGISTER_DUPLICATE_MESSAGE: Record<string, string> = {
  email: 'Email already exists',
  userName: 'UserName already exists',
};

export const TITLE_BY_STATUS: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Content',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
};
