import authStrategy from '../auth-strategy';

describe(authStrategy.name, () => {
  const originalEnv = process.env.CADENCE_WEB_AUTH_STRATEGY;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.CADENCE_WEB_AUTH_STRATEGY;
    } else {
      process.env.CADENCE_WEB_AUTH_STRATEGY = originalEnv;
    }
  });

  it.each(['disabled', 'jwt'] as const)(
    'returns %s when configured',
    (strategy) => {
      process.env.CADENCE_WEB_AUTH_STRATEGY = strategy;
      expect(authStrategy()).toBe(strategy);
    }
  );

  it.each([undefined, 'bogus', 'JWT'])(
    'falls back to disabled for %j',
    (value) => {
      if (value === undefined) {
        delete process.env.CADENCE_WEB_AUTH_STRATEGY;
      } else {
        process.env.CADENCE_WEB_AUTH_STRATEGY = value;
      }
      expect(authStrategy()).toBe('disabled');
    }
  );
});
