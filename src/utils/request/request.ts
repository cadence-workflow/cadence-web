import getConfigValue from '../config/get-config-value';

import { RequestError } from './request-error';

export default async function request(
  url: string,
  options?: RequestInit & { omitUserHeaders?: boolean }
): Promise<Response> {
  let absoluteUrl = url;
  let userHeaders = {};
  const isRelativeUrl = url.startsWith('/');
  const isOnServer = typeof window === 'undefined';
  if (isOnServer && isRelativeUrl) {
    const port = await getConfigValue('CADENCE_WEB_PORT');
    absoluteUrl = `http://127.0.0.1:${port}${url}`;
    // propagate user headers from browser to server API calls
    // await headers() for Next 15 (Promise); Next 14 still accepts await on sync value.
    const headersList = await (await import('next/headers')).headers();
    userHeaders = Object.fromEntries(headersList.entries());
  }

  const { omitUserHeaders, headers, ...requestOptions } = options || {};
  // Add or remove existing user headers based on the omitUserHeaders flag
  const requestHeaders = omitUserHeaders
    ? headers
    : { ...userHeaders, ...(headers || {}) };

  return fetch(absoluteUrl, {
    cache: 'no-cache',
    ...requestOptions,
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
