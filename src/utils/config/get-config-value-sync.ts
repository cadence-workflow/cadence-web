import type { LoadedConfigServerStartResolvedValues } from './config.types';
import { loadedGlobalConfigs } from './global-configs-ref';

// synchronous version of getConfigValue returns only configurations that are evaluated on server start
export default function getConfigValueSync<
  K extends keyof LoadedConfigServerStartResolvedValues,
>(key: K): LoadedConfigServerStartResolvedValues[K] {
  if (typeof window !== 'undefined') {
    throw new Error('getConfigValueSync cannot be invoked on browser');
  }
  return loadedGlobalConfigs[key];
}
