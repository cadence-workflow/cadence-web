import authStrategy from '../auth-strategy';

describe(authStrategy.name, () => {
  const originalEnv = process.env.CADENCE_WEB_AUTH_STRATEGY;

  afterEach(() => {
    process.env.CADENCE_WEB_AUTH_STRATEGY = originalEnv;
  });

  it('returns the configured jwt strategy', () => {
    process.env.CADENCE_WEB_AUTH_STRATEGY = 'jwt';

    expect(authStrategy()).toBe('jwt');
  });

  it('falls back to disabled for invalid values', () => {
    process.env.CADENCE_WEB_AUTH_STRATEGY = 'JWT';

    expect(authStrategy()).toBe('disabled');
  });

  it('falls back to disabled when unset', () => {
    delete process.env.CADENCE_WEB_AUTH_STRATEGY;

    expect(authStrategy()).toBe('disabled');
  });
});
