import resolverSchemas from '../../config/dynamic/resolvers/schemas/resolver-schemas';

import type {
  LoadedConfigValue,
  LoadedConfigs,
  ArgsOfLoadedConfigResolver,
  ConfigKeysWithArgs,
  ConfigKeysWithoutArgs,
  ResolverSchemas,
} from './config.types';
import { loadedGlobalConfigs } from './global-configs-ref';

// Overload for keys requiring arguments
export default async function getConfigValue<K extends ConfigKeysWithArgs>(
  key: K,
  arg: ArgsOfLoadedConfigResolver<K>
): Promise<LoadedConfigValue<K>>;

// Overload for keys not requiring arguments (env configs)
export default async function getConfigValue<K extends ConfigKeysWithoutArgs>(
  key: K,
  arg?: undefined
): Promise<LoadedConfigValue<K>>;

export default async function getConfigValue<K extends keyof LoadedConfigs>(
  key: K,
  arg?: ArgsOfLoadedConfigResolver<K>
): Promise<LoadedConfigValue<K>> {
  if (typeof window !== 'undefined') {
    throw new Error('getConfigValue cannot be invoked on browser');
  }

  const value = loadedGlobalConfigs[key] as LoadedConfigs[K];

  if (typeof value === 'function') {
    const k = key as keyof ResolverSchemas;
    // validate runtime arguments and resolved value
    const { error: argsValidationError, data: validatedArg } =
      resolverSchemas[k].args.safeParse(arg);
    if (argsValidationError) {
      throw new Error(
        `Failed to parse config '${k}' arguments: ${argsValidationError.errors[0].message}`
      );
    }
    const resolvedValue = await value(validatedArg);
    const { error: valueValidationError, data: validatedValue } =
      resolverSchemas[k].returnType.safeParse(resolvedValue);
    if (valueValidationError) {
      throw new Error(
        `Failed to parse config '${k}' resolved value: ${valueValidationError.errors[0].message}`
      );
    }
    return validatedValue as LoadedConfigValue<K>;
  }

  return value as LoadedConfigValue<K>;
}
