import { type z } from 'zod';

import type dynamicConfigs from '@/config/dynamic/dynamic.config';

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };

type ConfigResolver<Args, ReturnType> = Args extends undefined
  ? () => ReturnType
  : (args: Args) => ReturnType;

export type ConfigAsyncResolverDefinition<
  Args,
  ReturnType,
  EvalOn extends ResolverEvaluateOn<Args>,
  IsPublic extends boolean = false,
> = {
  resolver: ConfigResolver<Args, Promise<ReturnType>>;
  isPublic?: IsPublic;
  evaluateOn: EvalOn;
};

export type ConfigSyncResolverDefinition<
  Args,
  ReturnType,
  EvalOn extends ResolverEvaluateOn<Args>,
  IsPublic extends boolean = false,
> = {
  resolver: ConfigResolver<Args, ReturnType>;
  isPublic?: IsPublic;
  evaluateOn: EvalOn;
};

export type ConfigEnvDefinition<IsPublic extends boolean = false> = {
  env: string;
  default: string;
  isPublic?: IsPublic;
  evaluateOn?: 'serverStart';
};

export type ConfigDefinition =
  | ConfigAsyncResolverDefinition<any, any, 'request' | 'serverStart', any>
  | ConfigSyncResolverDefinition<any, any, 'request' | 'serverStart', any>
  | ConfigEnvDefinition<any>;

export type ConfigDefinitionRecords = Record<string, ConfigDefinition>;

type ResolverType<
  Args,
  ReturnType,
  EvalOn extends ResolverEvaluateOn<Args>,
  IsPublic extends boolean,
> =
  | ConfigSyncResolverDefinition<Args, ReturnType, EvalOn, IsPublic>
  | ConfigAsyncResolverDefinition<Args, ReturnType, EvalOn, IsPublic>;

type ResolverEvaluateOn<Args> = Args extends undefined
  ? 'serverStart' | 'request'
  : 'request';

export type InferLoadedConfig<T extends Record<string, ConfigDefinition>> = {
  [K in keyof T]: T[K] extends ConfigEnvDefinition
    ? string // If it's an env definition, the value is a string
    : T[K] extends ResolverType<any, infer ReturnType, infer EvalOn, any>
      ? EvalOn extends 'serverStart'
        ? ReturnType // If it's a sync resolver with evaluateOn serverStart, return the type directly
        : T[K] extends ConfigSyncResolverDefinition<
              infer Args,
              infer ReturnType,
              any,
              any
            >
          ? ConfigResolver<Args, ReturnType> // If it's a sync resolver, it's a function with matching signature
          : T[K] extends ConfigAsyncResolverDefinition<
                infer Args,
                infer ReturnType,
                any,
                any
              >
            ? ConfigResolver<Args, Promise<ReturnType>> // If it's an async resolver, it's a promise-returning function
            : never // If it doesn't match any known type, it's never
      : never; //If it doesn't match any known type, it's never
};

export type ServerStartEvaluatedConfigDefintions<
  T extends ConfigDefinitionRecords,
> = {
  [K in keyof T as T[K] extends
    | ConfigEnvDefinition<any>
    | ConfigAsyncResolverDefinition<any, any, 'serverStart', any>
    | ConfigSyncResolverDefinition<any, any, 'serverStart', any>
    ? K
    : never]: T[K];
};

type PublicConfigsDefinitions<T extends ConfigDefinitionRecords> = OmitNever<{
  [K in keyof T]: T[K] extends
    | ConfigEnvDefinition<true>
    | ConfigAsyncResolverDefinition<any, any, any, true>
    | ConfigSyncResolverDefinition<any, any, any, true>
    ? T[K]
    : never;
}>;

type ConfigResolvedValues<T extends ConfigDefinitionRecords> = {
  [K in keyof T]: T[K] extends ResolverType<any, infer ReturnType, any, any>
    ? ReturnType
    : string;
};

export type InferResolverSchema<Definitions extends ConfigDefinitionRecords> = {
  [Key in keyof Definitions as Definitions[Key] extends ResolverType<
    any,
    any,
    any,
    any
  >
    ? Key
    : never]: Definitions[Key] extends ResolverType<
    infer Args,
    infer ReturnType,
    any,
    any
  >
    ? { args: z.ZodType<Args>; returnType: z.ZodType<ReturnType> }
    : never;
};

export type ArgsOfConfigsResolvers<
  C extends InferLoadedConfig<ConfigDefinitionRecords>,
> = {
  [Key in keyof C]: C[Key] extends ConfigResolver<infer Args, any>
    ? Args
    : undefined;
};

export type ArgsOfConfigResolver<
  C extends InferLoadedConfig<ConfigDefinitionRecords>,
  K extends keyof C,
> = ArgsOfConfigsResolvers<C>[K];

// Types based on dynamicConfigs const
export type DynamicConfig = typeof dynamicConfigs;

export type PublicDynamicConfigDefinitions =
  PublicConfigsDefinitions<DynamicConfig>;
export type PublicDynamicConfigKeys = keyof PublicDynamicConfigDefinitions;

export type LoadedConfigs = InferLoadedConfig<DynamicConfig>;

export type ArgsOfLoadedConfigResolver<K extends keyof LoadedConfigs> =
  ArgsOfConfigResolver<LoadedConfigs, K>;

export type ArgsOfLoadedConfigsResolvers =
  ArgsOfConfigsResolvers<LoadedConfigs>;

export type LoadedConfigResolvedValues = ConfigResolvedValues<DynamicConfig>;

export type LoadedConfigServerStartResolvedValues = ConfigResolvedValues<
  ServerStartEvaluatedConfigDefintions<DynamicConfig>
>;

export type LoadedConfigValue<K extends keyof LoadedConfigs> =
  LoadedConfigs[K] extends (args: any) => any
    ? ReturnType<LoadedConfigs[K]>
    : LoadedConfigs[K];

export type ConfigKeysWithArgs = {
  [K in keyof LoadedConfigs]: LoadedConfigs[K] extends ConfigResolver<
    undefined,
    any
  >
    ? never
    : LoadedConfigs[K] extends ConfigResolver<any, any>
      ? K
      : never;
}[keyof LoadedConfigs];

export type ConfigKeysWithoutArgs = Exclude<
  keyof LoadedConfigs,
  ConfigKeysWithArgs
>;

export type ResolverSchemas = InferResolverSchema<DynamicConfig>;

export type ArgsOfDynamicConfigResolver<K extends keyof ResolverSchemas> =
  ResolverSchemas[K]['args'];
