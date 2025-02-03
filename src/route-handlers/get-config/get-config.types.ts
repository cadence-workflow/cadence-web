import {
  type PublicLoadedResolvedValues,
  type ArgsOfLoadedConfigResolver,
  type PublicDynamicConfigKeys,
  type PublicConfigKeysWithArgs,
  type PublicConfigKeysWithoutArgs,
} from '@/utils/config/config.types';

export type GetConfigKeys = PublicDynamicConfigKeys;
export type GetConfigKeysWithArgs = PublicConfigKeysWithArgs;
export type GetConfigKeysWithoutArgs = PublicConfigKeysWithoutArgs;

export type GetConfigArgs<K extends PublicDynamicConfigKeys> =
  ArgsOfLoadedConfigResolver<K>;

export type GetConfigRequestQuery<K extends PublicDynamicConfigKeys> = {
  configKey: K;
  jsonArgs: GetConfigArgs<GetConfigKeys>;
};

export type GetConfigResponse<K extends PublicDynamicConfigKeys> =
  PublicLoadedResolvedValues[K];
