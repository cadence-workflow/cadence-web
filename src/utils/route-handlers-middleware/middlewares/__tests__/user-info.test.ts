import { type NextRequest } from 'next/server';

import userInfoMiddleware from '../user-info';

const mockRequest = { cookies: {} } as unknown as NextRequest;
const mockOptions = { params: {} };

describe('user-info middleware', () => {
  it('returns user info derived from auth info', async () => {
    const ctx: Record<string, unknown> = {
      authInfo: {
        authEnabled: true,
        auth: { isValidToken: true, token: 'abc' },
        isAdmin: false,
        groups: [],
        userName: 'tester',
        id: '123',
      },
    };

    const result = await userInfoMiddleware(mockRequest, mockOptions, ctx);

    expect(result).toEqual([
      'userInfo',
      {
        id: '123',
        userName: 'tester',
      },
    ]);
  });

  it('returns null when auth info is missing', async () => {
    const result = await userInfoMiddleware(mockRequest, mockOptions, {});

    expect(result).toEqual(['userInfo', null]);
  });

  it('returns null when auth info has no id', async () => {
    const result = await userInfoMiddleware(mockRequest, mockOptions, {
      authInfo: {
        authEnabled: true,
        auth: { isValidToken: true, token: 'abc' },
        isAdmin: false,
        groups: [],
        userName: 'display-name',
      },
    });

    expect(result).toEqual(['userInfo', null]);
  });
});
