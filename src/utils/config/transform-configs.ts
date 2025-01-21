import 'server-only';

import type {
  ConfigDefinitionRecords,
  InferResolverSchema,
  LoadedConfigs,
} from './config.types';

export default async function transformConfigs<
  C extends ConfigDefinitionRecords,
  S extends InferResolverSchema<C>,
>(configDefinitions: C, resolverSchemas: S): Promise<LoadedConfigs> {
  const resolvedEntries = await Promise.all(
    Object.entries(configDefinitions).map(async ([key, definition]) => {
      if ('resolver' in definition && definition.evaluateOn === 'serverStart') {
        const resolvedValue = await definition.resolver(undefined);
        const resolverSchema = resolverSchemas[key as keyof S];
        if (resolverSchema === undefined) {
          throw new Error(
            `Failed to parse config '${key}': resolver schema is required`
          );
        }
        const { error, data: validatedValue } =
          resolverSchema.returnType.safeParse(resolvedValue);
        if (error) {
          throw new Error(
            `Failed to parse config '${key}' resolved value: ${error.errors[0].message}`
          );
        }
        return [key, validatedValue];
      }
      if ('resolver' in definition) {
        return [key, definition.resolver];
      }

      const envValue = (process.env[definition.env] || '').trim();
      return [key, envValue === '' ? definition.default : envValue];
    })
  );
  const resolvedConfig = Object.fromEntries(resolvedEntries);

  return resolvedConfig;
}
