import { NextRequest } from 'next/server';

import { CADENCE_AUTH_COOKIE_NAME } from '@/utils/auth/auth-context';
import getConfigValue from '@/utils/config/get-config-value';

import { GET } from '../route';

jest.mock('@/utils/config/get-config-value');

const mockGetConfigValue = getConfigValue as jest.MockedFunction<
  typeof getConfigValue
>;

const setAuthStrategy = (strategy: 'jwt' | 'disabled') => {
  mockGetConfigValue.mockImplementation(async (key: string) => {
    if (key === 'CADENCE_WEB_AUTH_STRATEGY') return strategy;
    return '';
  });
};

const buildToken = (claims: Record<string, unknown>) => {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return ['header', payload, 'signature'].join('.');
};

const buildRequest = (cookie?: string) => {
  const headers = new Headers();
  if (cookie) {
    headers.set('cookie', `${CADENCE_AUTH_COOKIE_NAME}=${cookie}`);
  }
  return new NextRequest('http://localhost/api/auth/me', {
    method: 'GET',
    headers,
  });
};

const expectNoStore = (response: Response) => {
  expect(response.headers.get('Cache-Control')).toBe('no-store');
};

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns authenticated context for a valid token', async () => {
    setAuthStrategy('jwt');

    const token = buildToken({
      sub: 'user-id',
      name: 'test-user',
      groups: 'reader writer',
      admin: false,
    });

    const response = await GET(buildRequest(token));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      authEnabled: true,
      isAuthenticated: true,
      isAdmin: false,
      groups: ['reader', 'writer'],
      userName: 'test-user',
      id: 'user-id',
    });
    expect(body).not.toHaveProperty('token');
  });

  it('returns unauthenticated context when no cookie is present', async () => {
    setAuthStrategy('jwt');

    const response = await GET(buildRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      authEnabled: true,
      isAuthenticated: false,
      isAdmin: false,
      groups: [],
    });
    expect(body).not.toHaveProperty('token');
  });

  it('returns auth-disabled context when strategy is disabled', async () => {
    setAuthStrategy('disabled');

    const response = await GET(buildRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      authEnabled: false,
      isAuthenticated: false,
    });
  });

  it('never exposes the token in the response', async () => {
    setAuthStrategy('jwt');

    const token = buildToken({ sub: 'user-id', name: 'test-user' });
    const response = await GET(buildRequest(token));
    const body = await response.json();

    expect(body).not.toHaveProperty('token');
    expect(JSON.stringify(body)).not.toContain(token);
  });

  it('sets Cache-Control: no-store', async () => {
    setAuthStrategy('disabled');

    const response = await GET(buildRequest());

    expectNoStore(response);
  });
});
