import 'server-only';

import configDefinitions from '../../config/dynamic/dynamic.config';

import type { LoadedConfigs } from './config.types';
import transformConfigs from './transform-configs';

export default function getTransformedConfigs(): LoadedConfigs<
  typeof configDefinitions
> {
  return transformConfigs(configDefinitions);
}
