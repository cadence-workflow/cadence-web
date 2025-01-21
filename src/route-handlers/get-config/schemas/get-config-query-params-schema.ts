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
        code: z.ZodIssueCode.invalid_enum_value,
        options: publicConfigKeys,
        received: configKey,
        fatal: true,
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
          code: z.ZodIssueCode.custom,
          message: `Invalid jsonArgs type provided. ${error.errors[0].message}`,
          fatal: true,
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
