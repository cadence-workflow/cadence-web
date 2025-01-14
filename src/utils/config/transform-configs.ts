import 'server-only';

import type { ConfigDefinitionRecords, LoadedConfigs } from './config.types';

export default function transformConfigs<C extends ConfigDefinitionRecords>(
  configDefinitions: C
): LoadedConfigs<C> {
  const resolvedConfig = Object.fromEntries(
    Object.entries(configDefinitions).map(([key, definition]) => {
      if ('resolver' in definition) {
        return [key, definition.resolver];
      }

      const envValue = (process.env[definition.env] || '').trim();
      return [key, envValue ?? definition.default];
    })
  );

  return resolvedConfig;
}
