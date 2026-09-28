import disabledClientPolicy from '../disabled-client-policy';

describe('disabledClientPolicy', () => {
  it('declares no recovery surface and no auth menu labels', () => {
    expect(disabledClientPolicy.supportsSessionRecovery).toBe(false);
    expect(disabledClientPolicy.unauthenticatedRemedy).toBe('login');
    expect(disabledClientPolicy.labels).toBeUndefined();
  });

  it('login is a no-op and logout resolves', async () => {
    expect(() => disabledClientPolicy.login()).not.toThrow();
    await expect(disabledClientPolicy.logout()).resolves.toBeUndefined();
  });

  it('never attempts recovery on unauthorized', () => {
    expect(disabledClientPolicy.onUnauthorized({} as Response)).toBe(false);
  });
});
