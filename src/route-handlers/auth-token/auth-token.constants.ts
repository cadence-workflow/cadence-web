export const AUTH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

export const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store',
};

export const AUTH_TOKEN_SUCCESS_RESPONSE = {
  ok: true,
} as const;

export const INVALID_REQUEST_MESSAGE = 'Invalid request';
export const INVALID_REQUEST_BODY_MESSAGE = 'Invalid request body';
