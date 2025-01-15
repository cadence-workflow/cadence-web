import getConfigValue from '../get-config-value';

jest.mock('../global-configs-ref', () => ({
  loadedGlobalConfigs: {
    CADENCE_WEB_PORT: 'someValue',
  },
}));

describe('getConfigValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error when invoked in the browser', async () => {
    (global as any).window = {};
    await expect(getConfigValue('CADENCE_WEB_PORT', undefined)).rejects.toThrow(
      'getConfigValue cannot be invoked on browser'
    );
    delete (global as any).window;
  });
});
