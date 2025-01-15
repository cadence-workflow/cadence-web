import { type ConfigEnvDefinition, type LoadedConfigs } from '../config.types';
import { default as getTransformedConfigs } from '../get-transformed-configs';

type MockConfigDefinitions = {
  config1: ConfigEnvDefinition;
  config2: ConfigEnvDefinition;
};
jest.mock(
  '@/config/dynamic/dynamic.config',
  () =>
    ({
      config1: { env: '$$$_MOCK_ENV_CONFIG1', default: 'default1' },
      config2: { env: '$$$_MOCK_ENV_CONFIG2', default: 'default2' },
    }) satisfies MockConfigDefinitions
);

describe('getTransformedConfigs', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      $$$_MOCK_ENV_CONFIG1: 'envValue1',
      $$$_MOCK_ENV_CONFIG2: '',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return transformed dynamic configs', () => {
    const result = getTransformedConfigs();
    expect(result).toEqual({
      config1: 'envValue1',
      config2: 'default2',
    } satisfies LoadedConfigs<MockConfigDefinitions>);
  });
});
