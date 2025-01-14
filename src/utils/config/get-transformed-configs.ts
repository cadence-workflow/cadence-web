import 'server-only';

import configDefinitions from '../../config/dynamic/dynamic.config';

import type { LoadedConfigs } from './config.types';

const getTransformedConfigs = (): LoadedConfigs => {
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
};

export default getTransformedConfigs;
