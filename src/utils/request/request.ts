import getConfigValue from '../config/get-config-value';

import { RequestError } from './request-error';

export default async function request(
  url: string,
  options?: RequestInit
): Promise<Response> {
  let absoluteUrl = url;
  const isRelativeUrl = url.startsWith('/');
  const isOnServer = typeof window === 'undefined';
  if (isOnServer && isRelativeUrl) {
    const port = await getConfigValue('CADENCE_WEB_PORT');
    absoluteUrl = `http://127.0.0.1:${port}${url}`;
  }
  return fetch(absoluteUrl, { cache: 'no-cache', ...(options || {}) }).then(
    async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new RequestError(
          error.message,
          res.status,
          error.validationErrors,
          {
            cause: error.cause,
          }
        );
      }
      return res;
    }
  );
}
