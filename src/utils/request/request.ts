import { shouldAttemptAuthRecovery } from '../auth/helpers/should-attempt-auth-recovery';
import { handleApiUnauthorized } from '../auth/recovery/handle-api-unauthorized';
import getConfigValue from '../config/get-config-value';

import { RequestError } from './request-error';
import { type RequestOptions } from './request.types';

async function readRequestError(response: Response, url: string) {
  const error = await response.json();
  return new RequestError(
    error.message,
    url,
    response.status,
    error.validationErrors,
    {
      cause: error.cause,
    }
  );
}

export default async function request(
  url: string,
  options?: RequestOptions
): Promise<Response> {
  let absoluteUrl = url;
  let userHeaders = {};
  const isRelativeUrl = url.startsWith('/');
  const isOnServer = typeof window === 'undefined';
  if (isOnServer && isRelativeUrl) {
    const port = await getConfigValue('CADENCE_WEB_PORT');
    absoluteUrl = `http://127.0.0.1:${port}${url}`;
    // propagate user headers from browser to server API calls
    userHeaders = Object.fromEntries(
      await (await import('next/headers')).headers().entries()
    );
  }

  const {
    omitUserHeaders,
    headers,
    skipAuthRecovery,
    _authRetried,
    ...requestOptions
  } = options || {};
  // Add or remove existing user headers based on the omitUserHeaders flag
  const requestHeaders = omitUserHeaders
    ? headers
    : { ...userHeaders, ...(headers || {}) };

  const response = await fetch(absoluteUrl, {
    cache: 'no-cache',
    ...requestOptions,
    headers: requestHeaders,
  });

  if (
    !response.ok &&
    response.status === 401 &&
    shouldAttemptAuthRecovery(url, { skipAuthRecovery, _authRetried })
  ) {
    const recovery = await handleApiUnauthorized({
      returnTo: `${window.location.pathname}${window.location.search}`,
      notice: 'session-expired',
      response,
    });

    if (recovery?.kind === 'recovered') {
      // Retry exactly once: a second 401 hits the _authRetried exclusion and
      // throws, so a backend rejecting a fresh-looking token cannot loop
      // recovery forever while holding the cross-tab lock.
      return request(url, {
        ...options,
        _authRetried: true,
      });
    }
    // 'redirect': handleApiUnauthorized has navigated and never settles, so
    // this point is unreachable. undefined: recovery declined or failed —
    // fall through and throw the original 401.
  }

  if (!response.ok) {
    throw await readRequestError(response, url);
  }

  return response;
}
