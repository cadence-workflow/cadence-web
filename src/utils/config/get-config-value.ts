import type {
  LoadedConfigValue,
  LoadedConfigs,
  ArgOfConfigResolver,
  ConfigKeysWithArgs,
  ConfigKeysWithoutArgs,
} from './config.types';
import { loadedGlobalConfigs } from './global-configs-ref';

// Overload for keys requiring arguments
export default async function getConfigValue<K extends ConfigKeysWithArgs>(
  key: K,
  arg: ArgOfConfigResolver<K>
): Promise<LoadedConfigValue<K>>;

// Overload for keys not requiring arguments (env configs)
export default async function getConfigValue<K extends ConfigKeysWithoutArgs>(
  key: K,
  arg?: undefined
): Promise<LoadedConfigValue<K>>;

export default async function getConfigValue<K extends keyof LoadedConfigs>(
  key: K,
  arg?: ArgOfConfigResolver<K>
): Promise<LoadedConfigValue<K>> {
  if (typeof window !== 'undefined') {
    throw new Error('getConfigValue cannot be invoked on browser');
  }

  const value = loadedGlobalConfigs[key] as LoadedConfigs[K];

  if (typeof value === 'function') {
    return (await value(arg)) as LoadedConfigValue<K>;
  }

  return value as LoadedConfigValue<K>;
}
