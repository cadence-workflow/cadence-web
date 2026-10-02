import { NextRequest } from 'next/server';

import { JWT_AUTH_COOKIE_NAME } from '@/utils/auth/strategies/jwt/jwt-auth.constants';
import getConfigValue from '@/utils/config/get-config-value';
import logger from '@/utils/logger';

import { DELETE, POST } from '../route';

jest.mock('@/utils/config/get-config-value');
jest.mock('@/utils/logger', () => ({
  __esModule: true,
  default: { warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

const mockGetConfigValue = getConfigValue as jest.MockedFunction<
  typeof getConfigValue
>;
const mockLoggerWarn = jest.mocked(logger.warn);

mockGetConfigValue.mockImplementation(async (key: string) => {
  if (key === 'CADENCE_WEB_AUTH_STRATEGY') return 'jwt';
  return '';
});

const VALID_JWT = 'header.payload.signature';

const buildRequest = (
  body: unknown,
  options?: {
    proto?: string;
    xForwardedProto?: string;
    origin?: string;
    xForwardedHost?: string;
    host?: string;
    hostname?: string;
  }
) => {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (options?.xForwardedProto) {
    headers.set('x-forwarded-proto', options.xForwardedProto);
  }
  if (options?.host) {
    headers.set('host', options.host);
  }
  if (options?.origin) {
    headers.set('origin', options.origin);
  }
  if (options?.xForwardedHost) {
    headers.set('x-forwarded-host', options.xForwardedHost);
  }
  const protocol = options?.proto ?? 'http';
  const hostname = options?.hostname ?? 'localhost';
  return new NextRequest(`${protocol}://${hostname}/api/auth/token`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
};

const buildDeleteRequest = (options?: { xForwardedProto?: string }) => {
  const headers = new Headers();
  if (options?.xForwardedProto) {
    headers.set('x-forwarded-proto', options.xForwardedProto);
  }
  return new NextRequest('http://localhost/api/auth/token', {
    method: 'DELETE',
    headers,
  });
};

const getSetCookie = (response: Response) => {
  const raw = response.headers.getSetCookie();
  return raw.map((c) => {
    const parts = c.split(';').map((p) => p.trim());
    const [nameValue, ...attrs] = parts;
    const [name, ...valueParts] = nameValue.split('=');
    return {
      name,
      value: valueParts.join('='),
      attributes: Object.fromEntries(
        attrs.map((a) => {
          const [k, ...v] = a.split('=');
          return [k.toLowerCase(), v.join('=') || true];
        })
      ),
    };
  });
};

const getAuthCookie = (response: Response) => {
  const authCookie = getSetCookie(response).find(
    (c) => c.name === JWT_AUTH_COOKIE_NAME
  );
  expect(authCookie).toBeDefined();
  return authCookie!;
};

const expectNoStore = (response: Response) => {
  expect(response.headers.get('Cache-Control')).toBe('no-store');
};

describe('POST /api/auth/token', () => {
  it('sets auth cookie for a valid JWT', async () => {
    const token = VALID_JWT;
    const response = await POST(buildRequest({ token }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });

    const authCookie = getAuthCookie(response);
    expect(authCookie!.value).toBe(token);
    expect(authCookie!.attributes).toMatchObject({
      httponly: true,
      samesite: 'lax',
      path: '/',
    });
  });

  it('strips "Bearer " prefix from token', async () => {
    const response = await POST(buildRequest({ token: `Bearer ${VALID_JWT}` }));
    const authCookie = getAuthCookie(response);

    expect(response.status).toBe(200);
    expect(authCookie!.value).toBe(VALID_JWT);
  });

  it('strips "bearer " prefix case-insensitively', async () => {
    const response = await POST(buildRequest({ token: `bEaReR ${VALID_JWT}` }));
    const authCookie = getAuthCookie(response);

    expect(response.status).toBe(200);
    expect(authCookie!.value).toBe(VALID_JWT);
  });

  it.each([
    ['missing token field', {}, 'Token is required'],
    ['non-string token', { token: 123 }, 'Token must be a string'],
    ['empty token', { token: '   ' }, 'Token cannot be empty'],
    [
      'token that is not in JWT format',
      { token: 'not-a-jwt' },
      /JWT.*header\.payload\.signature/,
    ],
    ['non-object body', 'just a string', 'Request body must be a JSON object'],
  ])(
    'rejects %s',
    async (_name, requestBody, expectedMessage: string | RegExp) => {
      const response = await POST(buildRequest(requestBody));
      const body = await response.json();

      expect(response.status).toBe(400);
      if (expectedMessage instanceof RegExp) {
        expect(body.message).toMatch(expectedMessage);
      } else {
        expect(body.message).toBe(expectedMessage);
      }
    }
  );

  it('rejects malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/auth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{bad json',
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe('Invalid request body');
  });

  it('uses the resolved secure attribute when setting the auth cookie', async () => {
    const response = await POST(
      buildRequest({ token: VALID_JWT }, { xForwardedProto: 'https' })
    );
    const authCookie = getAuthCookie(response);

    expect(authCookie!.attributes).toHaveProperty('secure', true);
  });

  it('warns when writing the auth cookie over plain HTTP to a non-loopback host', async () => {
    const response = await POST(
      buildRequest(
        { token: VALID_JWT },
        { hostname: 'cadence.internal.example' }
      )
    );

    expect(response.status).toBe(200);
    expect(mockLoggerWarn).toHaveBeenCalledWith(
      expect.objectContaining({ host: 'cadence.internal.example' }),
      'Writing auth cookies without the Secure attribute on a non-loopback host'
    );
  });

  it('sets Cache-Control: no-store on all responses', async () => {
    const success = await POST(buildRequest({ token: VALID_JWT }));
    const failure = await POST(buildRequest({}));

    expectNoStore(success);
    expectNoStore(failure);
  });

  describe('same-origin guard', () => {
    it('accepts a request without an Origin header', async () => {
      const response = await POST(buildRequest({ token: VALID_JWT }));

      expect(response.status).toBe(200);
    });

    it('accepts a request whose Origin matches the request host', async () => {
      const response = await POST(
        buildRequest(
          { token: VALID_JWT },
          { origin: 'http://localhost', host: 'localhost' }
        )
      );

      expect(response.status).toBe(200);
    });

    it('rejects a cross-site request and sets no cookie', async () => {
      const response = await POST(
        buildRequest({ token: VALID_JWT }, { origin: 'https://evil.example' })
      );
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.message).toBe('Cross-origin request rejected');
      expect(response.headers.getSetCookie()).toHaveLength(0);
      expectNoStore(response);
    });

    it('rejects a malformed Origin header', async () => {
      const response = await POST(
        buildRequest({ token: VALID_JWT }, { origin: 'not a url' })
      );

      expect(response.status).toBe(403);
    });

    it('compares Origin against the forwarded host when present', async () => {
      const accepted = await POST(
        buildRequest(
          { token: VALID_JWT },
          {
            origin: 'https://cadence.example',
            xForwardedHost: 'cadence.example',
          }
        )
      );
      expect(accepted.status).toBe(200);

      const rejected = await POST(
        buildRequest(
          { token: VALID_JWT },
          { origin: 'https://evil.example', xForwardedHost: 'cadence.example' }
        )
      );
      expect(rejected.status).toBe(403);
    });
  });
});

describe('DELETE /api/auth/token', () => {
  it('clears the auth cookie', async () => {
    const response = await DELETE(buildDeleteRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });

    const authCookie = getAuthCookie(response);
    expect(authCookie!.value).toBe('');
    expect(authCookie!.attributes).toMatchObject({
      'max-age': '0',
      httponly: true,
      path: '/',
    });
  });

  it('sets secure=true when behind HTTPS proxy', async () => {
    const response = await DELETE(
      buildDeleteRequest({ xForwardedProto: 'https' })
    );
    const authCookie = getAuthCookie(response);

    expect(authCookie!.attributes).toHaveProperty('secure', true);
  });

  it('sets Cache-Control: no-store', async () => {
    const response = await DELETE(buildDeleteRequest());

    expectNoStore(response);
  });
});
