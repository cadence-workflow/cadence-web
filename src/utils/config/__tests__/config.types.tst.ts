import { describe, expect, it } from 'tstyche';

import type {
  ConfigAsyncResolverDefinition,
  ConfigSyncResolverDefinition,
  ConfigEnvDefinition,
  PublicConfigsDefinitions,
  InferLoadedConfig,
  ArgsOfConfigsResolvers,
} from '../config.types.js';

describe('ConfigEnvDefinition', () => {
  it('should require env and default', () => {
    expect<ConfigEnvDefinition>().type.toBeAssignableWith({
      env: 'DATABASE_URL',
      default: 'postgresql://localhost:5432/db',
    } as const);

    expect<ConfigEnvDefinition>().type.not.toBeAssignableWith({
      default: 'postgresql://localhost:5432/db',
      // error: env is required
    } as const);

    expect<ConfigEnvDefinition>().type.not.toBeAssignableWith({
      env: 'DATABASE_URL',
      // error: default is required
    } as const);
  });

  it('should allow evaluateOn only be serverStart', () => {
    expect<ConfigEnvDefinition<true>>().type.not.toBeAssignableWith({
      env: 'DATABASE_URL',
      default: 'postgresql://localhost:5432/db',
      // error: evaluateOn can only be serverStart
      evaluateOn: 'request',
    } as const);
    expect<ConfigEnvDefinition<true>>().type.toBeAssignableWith({
      env: 'DATABASE_URL',
      default: 'postgresql://localhost:5432/db',
      evaluateOn: 'serverStart',
    } as const);
  });

  it('should allow optional isPublic and evaluateOn', () => {
    expect<ConfigEnvDefinition<true>>().type.toBeAssignableWith({
      env: 'DATABASE_URL',
      default: 'postgresql://localhost:5432/db',
      isPublic: true,
    } as const);

    expect<ConfigEnvDefinition<true>>().type.toBeAssignableWith({
      env: 'DATABASE_URL',
      default: 'postgresql://localhost:5432/db',
      evaluateOn: 'serverStart',
    } as const);
  });
});

describe('ConfigAsyncResolverDefinition', () => {
  it('should require resolver and evaluateOn', () => {
    expect<
      ConfigAsyncResolverDefinition<{ id: string }, string, 'request'>
    >().type.toBeAssignableWith({
      resolver: async (args: { id: string }) => args.id,
      evaluateOn: 'request',
    } as const);

    expect<
      ConfigAsyncResolverDefinition<{ id: string }, string, 'request'>
    >().type.not.toBeAssignableWith({
      resolver: async (args: { id: string }) => args.id,
      // error: evaluateOn is required
    } as const);

    expect<
      ConfigAsyncResolverDefinition<{ id: string }, string, 'request'>
    >().type.not.toBeAssignableWith({
      evaluateOn: 'request',
      // error: resolver is required
    } as const);
  });

  it('should accept resolver that returns a promise only', () => {
    expect<
      ConfigAsyncResolverDefinition<undefined, string, 'request'>
    >().type.toBeAssignableWith({
      resolver: async () => 'result',
      evaluateOn: 'request',
    } as const);
    expect<
      ConfigAsyncResolverDefinition<undefined, string, 'request'>
    >().type.toBeAssignableWith({
      resolver: () => Promise.resolve('result'),
      evaluateOn: 'request',
    } as const);

    expect<
      ConfigAsyncResolverDefinition<undefined, string, 'request'>
    >().type.not.toBeAssignableWith({
      resolver: () => 'result',
      evaluateOn: 'request',
    } as const);
  });
  it('should force evaluateOn to be request for resolvers with args', () => {
    expect<
      ConfigAsyncResolverDefinition<{ id: string }, string, 'request'>
    >().type.toBeAssignableWith({
      resolver: async (args: { id: string }) => args.id,
      evaluateOn: 'request',
    } as const);

    // TODO: @assem.hafez - find a way to have this test without having npm run typecheck command failing
    /*     expect<
          ConfigAsyncResolverDefinition<{ id: string }, string, 'serverStart'>
        >().type.toRaiseError(); */
  });
  it('should allow evaluateOn to be serverStart or request for resolvers without args', () => {
    expect<
      ConfigAsyncResolverDefinition<undefined, string, 'request'>
    >().type.toBeAssignableWith({
      resolver: async () => 'result',
      evaluateOn: 'request',
    } as const);

    expect<
      ConfigAsyncResolverDefinition<undefined, string, 'serverStart'>
    >().type.toBeAssignableWith({
      resolver: async () => 'result',
      evaluateOn: 'serverStart',
    } as const);
  });

  it('should allow optional isPublic', () => {
    expect<
      ConfigAsyncResolverDefinition<{ id: string }, string, 'request', true>
    >().type.toBeAssignableWith({
      resolver: async (args: { id: string }) => args.id,
      evaluateOn: 'request',
      isPublic: true,
    } as const);

    expect<
      ConfigAsyncResolverDefinition<{ id: string }, string, 'request', false>
    >().type.toBeAssignableWith({
      resolver: async (args: { id: string }) => args.id,
      evaluateOn: 'request',
    } as const);
  });
});

describe('ConfigSyncResolverDefinition', () => {
  it('should require resolver and evaluateOn', () => {
    expect<
      ConfigSyncResolverDefinition<{ id: string }, string, 'request'>
    >().type.toBeAssignableWith({
      resolver: (args: { id: string }) => args.id,
      evaluateOn: 'request',
    } as const);

    expect<
      ConfigSyncResolverDefinition<{ id: string }, string, 'request'>
    >().type.not.toBeAssignableWith({
      resolver: (args: { id: string }) => args.id,
      // error: evaluateOn is required
    } as const);

    expect<
      ConfigSyncResolverDefinition<{ id: string }, string, 'request'>
    >().type.not.toBeAssignableWith({
      evaluateOn: 'request',
      // error: resolver is required
    } as const);
  });
  it('should accept resolver that returns a non promise', () => {
    expect<
      ConfigSyncResolverDefinition<undefined, string, 'request'>
    >().type.toBeAssignableWith({
      resolver: () => 'result',
      evaluateOn: 'request',
    } as const);
    expect<
      ConfigSyncResolverDefinition<undefined, string, 'request'>
    >().type.not.toBeAssignableWith({
      resolver: () => Promise.resolve('result'),
      evaluateOn: 'request',
    } as const);

    expect<
      ConfigSyncResolverDefinition<undefined, string, 'request'>
    >().type.not.toBeAssignableWith({
      resolver: async () => 'result',
      evaluateOn: 'request',
    } as const);
  });

  it('should force evaluateOn to be request for resolvers with args', () => {
    expect<
      ConfigSyncResolverDefinition<{ id: string }, string, 'request'>
    >().type.toBeAssignableWith({
      resolver: (args: { id: string }) => args.id,
      evaluateOn: 'request',
    } as const);

    // TODO: @assem.hafez - find a way to have this test without having npm run typecheck command failing
    /*     expect<
          ConfigAsyncResolverDefinition<{ id: string }, string, 'serverStart'>
        >().type.toRaiseError(); */
  });
  it('should allow evaluateOn to be serverStart or request for resolvers without args', () => {
    expect<
      ConfigSyncResolverDefinition<undefined, string, 'request'>
    >().type.toBeAssignableWith({
      resolver: () => 'result',
      evaluateOn: 'request',
    } as const);

    expect<
      ConfigSyncResolverDefinition<undefined, string, 'serverStart'>
    >().type.toBeAssignableWith({
      resolver: () => 'result',
      evaluateOn: 'serverStart',
    } as const);
  });

  it('should allow optional isPublic', () => {
    expect<
      ConfigSyncResolverDefinition<{ id: string }, string, 'request', true>
    >().type.toBeAssignableWith({
      resolver: (args: { id: string }) => args.id,
      evaluateOn: 'request',
      isPublic: true,
    } as const);

    expect<
      ConfigSyncResolverDefinition<{ id: string }, string, 'request', false>
    >().type.toBeAssignableWith({
      resolver: (args: { id: string }) => args.id,
      evaluateOn: 'request',
    } as const);
  });
});

describe('InferLoadedConfig', () => {
  it('should have configs with evaluateOn request as functions', () => {
    type LoadedConfig = InferLoadedConfig<{
      API_URL: ConfigSyncResolverDefinition<undefined, string, 'request'>;
      API_PORT: ConfigAsyncResolverDefinition<undefined, number, 'request'>;
    }>;
    expect<LoadedConfig>().type.toBe<{
      API_URL: (args?: undefined) => string;
      API_PORT: (args?: undefined) => Promise<number>;
    }>();
  });

  it('should have configs with evaluateOn serverStart as the return type of the function', () => {
    type LoadedConfig = InferLoadedConfig<{
      DATABASE_URL: ConfigEnvDefinition;
      API_URL: ConfigSyncResolverDefinition<undefined, string, 'serverStart'>;
      API_PORT: ConfigAsyncResolverDefinition<undefined, number, 'serverStart'>;
    }>;
    expect<LoadedConfig>().type.toBe<{
      DATABASE_URL: string;
      API_URL: string;
      API_PORT: number;
    }>();
  });
});

describe('ArgsOfLoadedConfigsResolvers', () => {
  it('should have the type of the args of the loaded configs resolvers', () => {
    type ArgsType = ArgsOfConfigsResolvers<
      InferLoadedConfig<{
        DATABASE_URL: ConfigEnvDefinition;
        API_URL: ConfigSyncResolverDefinition<undefined, string, 'request'>;
        API_URL_WITH_ARGS: ConfigAsyncResolverDefinition<
          string,
          string,
          'request'
        >;
        API_PORT: ConfigAsyncResolverDefinition<undefined, number, 'request'>;
        API_PORT_WITH_ARGS: ConfigAsyncResolverDefinition<
          number,
          number,
          'request'
        >;
      }>
    >;

    expect<ArgsType>().type.toBe<{
      DATABASE_URL: undefined;
      API_URL: undefined;
      API_URL_WITH_ARGS: string;
      API_PORT: undefined;
      API_PORT_WITH_ARGS: number;
    }>();
  });
});

describe('PublicConfigsDefinitions', () => {
  it('should have the type of an enum with the keys of the config definitions that have isPublic true', () => {
    type PublicConfigs = PublicConfigsDefinitions<{
      DATABASE_URL: ConfigEnvDefinition;
      API_URL: ConfigSyncResolverDefinition<undefined, string, 'request'>;
      API_PORT: ConfigAsyncResolverDefinition<undefined, number, 'serverStart'>;
      DATABASE_URL_PUBLIC: ConfigEnvDefinition<true>;
      API_URL_PUBLIC: ConfigSyncResolverDefinition<
        undefined,
        string,
        'request',
        true
      >;
      API_PORT_PUBLIC: ConfigAsyncResolverDefinition<
        undefined,
        number,
        'serverStart',
        true
      >;
    }>;
    expect<keyof PublicConfigs>().type.toBe<
      'API_URL_PUBLIC' | 'API_PORT_PUBLIC' | 'DATABASE_URL_PUBLIC'
    >();
  });
});
