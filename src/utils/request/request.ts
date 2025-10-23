import getConfigValue from '../config/get-config-value';

import { RequestError } from './request-error';

export default async function request(
  url: string,
  options?: RequestInit
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
  const requestHeaders = { ...userHeaders, ...(options?.headers || {}) };
  return fetch(absoluteUrl, {
    cache: 'no-cache',
    ...(options || {}),
    headers: requestHeaders,
  }).then(async (res) => {
    if (!res.ok) {
      const error = await res.json();
      throw new RequestError(
        error.message,
        url,
        res.status,
        error.validationErrors,
        {
          cause: error.cause,
        }
      );
    }
    return res;
  });
}
