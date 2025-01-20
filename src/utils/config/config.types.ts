import { type z } from 'zod';

import type dynamicConfigs from '@/config/dynamic/dynamic.config';

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

type ResolverType<Args, ReturnType, EvalOn extends ResolverEvaluateOn<Args>> =
  | ConfigSyncResolverDefinition<Args, ReturnType, EvalOn>
  | ConfigAsyncResolverDefinition<Args, ReturnType, EvalOn>;

type ResolverEvaluateOn<Args> = Args extends undefined
  ? 'serverStart' | 'request'
  : 'request';

export type InferLoadedConfig<T extends Record<string, ConfigDefinition>> = {
  [K in keyof T]: T[K] extends ConfigEnvDefinition
    ? string // If it's an env definition, the value is a string
    : T[K] extends ResolverType<any, infer ReturnType, infer EvalOn>
      ? EvalOn extends 'serverStart'
        ? ReturnType // If it's a sync resolver with evaluateOn serverStart, return the type directly
        : T[K] extends ConfigSyncResolverDefinition<
              infer Args,
              infer ReturnType,
              any
            >
          ? ConfigResolver<Args, ReturnType> // If it's a sync resolver, it's a function with matching signature
          : T[K] extends ConfigAsyncResolverDefinition<
                infer Args,
                infer ReturnType,
                any
              >
            ? ConfigResolver<Args, Promise<ReturnType>> // If it's an async resolver, it's a promise-returning function
            : never // If it doesn't match any known type, it's never
      : never; //If it doesn't match any known type, it's never
};

export type InferResolverSchema<Definitions extends ConfigDefinitionRecords> = {
  [Key in keyof Definitions as Definitions[Key] extends ResolverType<
    any,
    any,
    any
  >
    ? Key
    : never]: Definitions[Key] extends ResolverType<
    infer Args,
    infer ReturnType,
    any
  >
    ? { args: z.ZodType<Args>; returnType: z.ZodType<ReturnType> }
    : never;
};

export type ArgsOfConfigResolver<
  C extends InferLoadedConfig<ConfigDefinitionRecords>,
  K extends keyof C,
> = C[K] extends (args: any) => any ? Parameters<C[K]>[0] : undefined;

// Types based on dynamicConfigs const
type LoadedPublicConfigs<T extends ConfigDefinitionRecords> = {
  [K in keyof T]: T[K] extends
    | ConfigEnvDefinition<infer IsPublic>
    | ConfigAsyncResolverDefinition<any, any, any, infer IsPublic>
    | ConfigSyncResolverDefinition<any, any, any, infer IsPublic>
    ? IsPublic extends true // If it's an env definition, the value is a string
      ? K
      : never
    : never; //If it doesn't match any known type, it's never
}[keyof LoadedConfigs];

export type PublicConfigKeys = LoadedPublicConfigs<typeof dynamicConfigs>;

export type DynamicConfig = typeof dynamicConfigs;

export type LoadedConfigs<
  C extends ConfigDefinitionRecords = typeof dynamicConfigs,
> = InferLoadedConfig<C>;

export type ArgsOfLoadedConfigResolver<K extends keyof LoadedConfigs> =
  ArgsOfConfigResolver<LoadedConfigs, K>;

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

export type ResolverSchemas = InferResolverSchema<typeof dynamicConfigs>;
