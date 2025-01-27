import {
  type ArgsOfLoadedConfigResolver,
  type PublicDynamicConfigKeys,
  type PublicLoadedConfig,
} from '@/utils/config/config.types';

export type GetConfigResponse<K extends PublicDynamicConfigKeys> =
  PublicLoadedConfig[K];
export type GetConfigKeys = PublicDynamicConfigKeys;
export type GetConfigArgs<K extends PublicDynamicConfigKeys> =
  ArgsOfLoadedConfigResolver<K>;
export type GetConfigRequestQuery<K extends PublicDynamicConfigKeys> = {
  configKey: K;
  jsonArgs: GetConfigArgs<GetConfigKeys>;
};
