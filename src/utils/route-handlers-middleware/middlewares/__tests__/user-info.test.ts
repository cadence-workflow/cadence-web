import userInfoMiddleware from '../user-info';

describe('user-info middleware', () => {
  it('returns user info derived from auth info', async () => {
    const ctx: Record<string, unknown> = {
      authInfo: {
        authEnabled: true,
        token: 'abc',
        isAdmin: false,
        groups: [],
        userName: 'tester',
        id: 'tester',
      },
    };

    const result = await userInfoMiddleware(
      { cookies: {} } as any,
      { params: {} } as any,
      ctx
    );

    expect(result).toEqual([
      'userInfo',
      {
        id: 'tester',
        userName: 'tester',
      },
    ]);
  });

  it('returns undefined when auth info is missing', async () => {
    const result = await userInfoMiddleware(
      { cookies: {} } as any,
      { params: {} } as any,
      {}
    );

    expect(result).toEqual(['userInfo', undefined]);
  });

  it('returns undefined when auth info has no id and userName', async () => {
    const result = await userInfoMiddleware(
      { cookies: {} } as any,
      { params: {} } as any,
      {
        authInfo: {
          authEnabled: true,
          isAdmin: false,
          groups: [],
          token: 'abc',
        },
      }
    );

    expect(result).toEqual(['userInfo', undefined]);
  });

  it('returns partial user info when only userName exists', async () => {
    const result = await userInfoMiddleware(
      { cookies: {} } as any,
      { params: {} } as any,
      {
        authInfo: {
          authEnabled: true,
          isAdmin: false,
          groups: [],
          token: 'abc',
          userName: 'display-name',
        },
      }
    );

    expect(result).toEqual([
      'userInfo',
      {
        id: undefined,
        userName: 'display-name',
      },
    ]);
  });
});
