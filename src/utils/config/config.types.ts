import { type z } from 'zod';

import type dynamicConfigs from '@/config/dynamic/dynamic.config';

export type ConfigAsyncResolverDefinition<Args, ReturnType> = {
  resolver: (args: Args) => Promise<ReturnType>;
};

export type ConfigSyncResolverDefinition<Args, ReturnType> = {
  resolver: (args: Args) => ReturnType;
  //forceSync?: boolean; // would be replaced in upcoming PR
};

export type ConfigEnvDefinition = {
  env: string;
  default: string;
  // forceSync?: boolean; // would be replaced in upcoming PR
};

type InferLoadedConfig<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends ConfigEnvDefinition
    ? string // If it's an env definition, the value is a string
    : T[K] extends ConfigSyncResolverDefinition<infer Args, infer ReturnType>
      ? (args: Args) => ReturnType // If it's a sync resolver, it's a function with matching signature
      : T[K] extends ConfigAsyncResolverDefinition<infer Args, infer ReturnType>
        ? (args: Args) => Promise<ReturnType> // If it's an async resolver, it's a promise-returning function
        : never; // If it doesn't match any known type, it's never
};

export type LoadedConfigs = InferLoadedConfig<typeof dynamicConfigs>;

export type ArgOfConfigResolver<K extends keyof LoadedConfigs> =
  LoadedConfigs[K] extends (args: any) => any
    ? Parameters<LoadedConfigs[K]>[0]
    : undefined;

export type LoadedConfigValue<K extends keyof LoadedConfigs> =
  LoadedConfigs[K] extends (args: any) => any
    ? ReturnType<LoadedConfigs[K]>
    : string;

export type ConfigKeysWithArgs = {
  [K in keyof LoadedConfigs]: LoadedConfigs[K] extends (args: undefined) => any
    ? never
    : LoadedConfigs[K] extends (args: any) => any
      ? K
      : never;
}[keyof LoadedConfigs];

export type ConfigKeysWithoutArgs = Exclude<
  keyof LoadedConfigs,
  ConfigKeysWithArgs
>;

type ResolverType<Args, ReturnType> =
  | ConfigSyncResolverDefinition<Args, ReturnType>
  | ConfigAsyncResolverDefinition<Args, ReturnType>;

export type InferResolverSchema<Definitions extends Record<string, any>> = {
  [Key in keyof Definitions]: Definitions[Key] extends ResolverType<
    infer Args,
    infer ReturnType
  >
    ? { args: z.ZodType<Args>; returnType: z.ZodType<ReturnType> }
    : never;
};

export type ResolverSchemas = InferResolverSchema<typeof dynamicConfigs>;
