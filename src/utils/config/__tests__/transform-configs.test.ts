import { z } from 'zod';

import {
  type InferResolverSchema,
  type ConfigEnvDefinition,
  type ConfigSyncResolverDefinition,
  type ConfigAsyncResolverDefinition,
  type InferLoadedConfig,
} from '../config.types';
import transformConfigs from '../transform-configs';

describe('getTransformedConfigs', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      $$$_MOCK_ENV_CONFIG1: 'envValue1',
      $$$_MOCK_ENV_CONFIG2: '',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should get value for existing non empty environment variables', async () => {
    const configs = {
      config1: { env: '$$$_MOCK_ENV_CONFIG1', default: 'default1' },
    } satisfies { config1: ConfigEnvDefinition };

    const resolversSchemas = {} as InferResolverSchema<typeof configs>;

    const result = await transformConfigs(configs, resolversSchemas);
    expect(result).toEqual({
      config1: 'envValue1',
    } satisfies InferLoadedConfig<typeof configs>);
  });

  it('should get default value for unset environment variables', async () => {
    const configs = {
      config2: { env: '$$$_MOCK_ENV_CONFIG2', default: 'default2' },
    } satisfies { config2: ConfigEnvDefinition };

    const resolversSchemas: InferResolverSchema<typeof configs> = {};

    const result = await transformConfigs(configs, resolversSchemas);
    expect(result).toEqual({
      config2: 'default2',
    } satisfies InferLoadedConfig<typeof configs>);
  });

  it('should get resolved value for configuration that is evaluated on server start', async () => {
    const configs = {
      config3: { evaluateOn: 'serverStart', resolver: jest.fn(() => 3) },
    } satisfies {
      config3: ConfigSyncResolverDefinition<undefined, number, 'serverStart'>;
    };

    const resolversSchemas: InferResolverSchema<typeof configs> = {
      config3: {
        args: z.undefined(),
        returnType: z.number(),
      },
    };

    const result = await transformConfigs(configs, resolversSchemas);
    expect(configs.config3.resolver).toHaveBeenCalledWith(undefined);
    expect(result).toEqual({
      config3: 3,
    } satisfies InferLoadedConfig<typeof configs>);
  });

  it('should get the resolver for configuration that is evaluated on request', async () => {
    const configs = {
      config3: { evaluateOn: 'request', resolver: (n) => n },
    } satisfies {
      config3: ConfigSyncResolverDefinition<number, number, 'request'>;
    };

    const resolversSchemas: InferResolverSchema<typeof configs> = {
      config3: {
        args: z.number(),
        returnType: z.number(),
      },
    };

    const result = await transformConfigs(configs, resolversSchemas);
    expect(result).toEqual({
      config3: configs.config3.resolver,
    } satisfies InferLoadedConfig<typeof configs>);
  });

  it('should throw an error if the resolved value does not match the schema', async () => {
    const configs = {
      config3: {
        evaluateOn: 'serverStart',
        // @ts-expect-error - intentionally testing invalid return type
        resolver: async () => '3',
      },
    } satisfies {
      config3: ConfigAsyncResolverDefinition<undefined, number, 'serverStart'>;
    };

    const resolversSchemas: InferResolverSchema<typeof configs> = {
      config3: {
        args: z.undefined(),
        // @ts-expect-error - intentionally testing invalid return type
        returnType: z.number(),
      },
    };

    await expect(transformConfigs(configs, resolversSchemas)).rejects.toThrow(
      /Failed to parse config 'config3' resolved value/
    );
  });
});
