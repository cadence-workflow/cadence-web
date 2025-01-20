import { z } from 'zod';

import {
  type ConfigEnvDefinition,
  type ConfigSyncResolverDefinition,
} from '../config.types';
import transformConfigs from '../transform-configs';

describe('transformConfigs', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      $$$_MOCK_ENV_CONFIG1: 'envValue1',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should add resolver function as is', async () => {
    const configDefinitions: {
      config1: ConfigEnvDefinition;
      config2: ConfigSyncResolverDefinition<undefined, string, 'request'>;
    } = {
      config1: { env: '$$$_MOCK_ENV_CONFIG1', default: 'default1' },
      config2: {
        resolver: () => 'resolvedValue',
        evaluateOn: 'request',
      },
    };

    const mockResolvedSchemas = {
      config2: {
        args: z.undefined(),
        returnType: z.string(),
      },
    };
    const result = await transformConfigs(
      configDefinitions,
      mockResolvedSchemas
    );
    expect(result).toEqual({
      config1: 'envValue1',
      config2: configDefinitions.config2.resolver,
    });
  });

  it('should return environment variable value when present', async () => {
    const configDefinitions: {
      config1: ConfigEnvDefinition;
    } = {
      config1: { env: '$$$_MOCK_ENV_CONFIG1', default: 'default1' },
    };
    const mockResolvedSchemas = {};
    const result = await transformConfigs(
      configDefinitions,
      mockResolvedSchemas
    );
    expect(result).toEqual({
      config1: 'envValue1',
    });
  });

  it('should return default value when environment variable is not present', async () => {
    const configDefinitions: {
      config3: ConfigEnvDefinition;
    } = {
      config3: { env: '$$$_MOCK_ENV_CONFIG3', default: 'default3' },
    };
    const mockResolvedSchemas = {};
    const result = await transformConfigs(
      configDefinitions,
      mockResolvedSchemas
    );
    expect(result).toEqual({
      config3: 'default3',
    });
  });
});
