import 'server-only';

import configDefinitions from '../../config/dynamic/dynamic.config';
import resolverSchemas from '../../config/dynamic/resolvers/schemas/resolver-schemas';

import type { LoadedConfigs } from './config.types';
import transformConfigs from './transform-configs';

export default async function getTransformedConfigs(): Promise<
  LoadedConfigs<typeof configDefinitions>
> {
  return await transformConfigs(configDefinitions, resolverSchemas);
}
