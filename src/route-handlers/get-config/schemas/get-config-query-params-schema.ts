import { z } from 'zod';

import dynamicConfigs from '@/config/dynamic/dynamic.config';
import resolverSchemas from '@/config/dynamic/resolvers/schemas/resolver-schemas';
import {
  type PublicDynamicConfigKeys,
  type ArgsOfLoadedConfigsResolvers,
} from '@/utils/config/config.types';

const publicConfigKeys = Object.entries(dynamicConfigs)
  .filter(([_, d]) => d.isPublic)
  .map(([k]) => k) as PublicDynamicConfigKeys[];

const getConfigValueQueryParamsSchema = z
  .object({
    configKey: z.string(),
    jsonArgs: z.string().optional(),
  })
  .transform((data, ctx) => {
    const configKey = data.configKey as PublicDynamicConfigKeys;

    // validate configKey
    if (!publicConfigKeys.includes(configKey)) {
      ctx.addIssue({
        code: 'invalid_value',
        values: [...publicConfigKeys],
        input: configKey,
        continue: false,
      });

      return z.NEVER;
    }

    // parse jsonArgs
    let parsedArgs;
    try {
      parsedArgs = data.jsonArgs
        ? JSON.parse(decodeURIComponent(data.jsonArgs))
        : undefined;
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
      return z.NEVER;
    }

    // validate jsonArgs
    const configKeyForSchema = configKey as keyof typeof resolverSchemas;
    let validatedArgs = parsedArgs;
    if (resolverSchemas[configKeyForSchema]) {
      const schema = resolverSchemas[configKey as keyof typeof resolverSchemas];
      const { error, data } = schema.args.safeParse(parsedArgs);
      validatedArgs = data;
      if (error) {
        ctx.addIssue({
          code: 'custom',
          message: `Invalid jsonArgs type provided. ${error.issues[0].message}`,
          continue: false,
        });
        return z.NEVER;
      }
    }
    const result: {
      configKey: PublicDynamicConfigKeys;
      jsonArgs: Pick<
        ArgsOfLoadedConfigsResolvers,
        PublicDynamicConfigKeys
      >[PublicDynamicConfigKeys];
    } = {
      configKey,
      jsonArgs: validatedArgs,
    };
    return result;
  });

export default getConfigValueQueryParamsSchema;
