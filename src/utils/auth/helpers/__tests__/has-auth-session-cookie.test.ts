import hasAuthSessionCookie from '../has-auth-session-cookie';

describe(hasAuthSessionCookie.name, () => {
  const cookieNames = {
    exact: ['cadence-authorization'],
    prefixes: ['cadence-oidc.'],
  };

  it.each(['cadence-authorization', 'cadence-oidc.0'])(
    'recognizes the active strategy cookie %s',
    (name) => {
      expect(
        hasAuthSessionCookie({ getAll: () => [{ name }] }, cookieNames)
      ).toBe(true);
    }
  );

  it('ignores unrelated cookies', () => {
    expect(
      hasAuthSessionCookie(
        { getAll: () => [{ name: 'unrelated' }] },
        cookieNames
      )
    ).toBe(false);
  });
});
