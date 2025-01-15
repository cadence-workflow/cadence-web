import 'server-only';

import type {
  ConfigAsyncResolverDefinition,
  ConfigEnvDefinition,
  ConfigSyncResolverDefinition,
} from '../../utils/config/config.types';

const dynamicConfigs: {
  CADENCE_WEB_PORT: ConfigEnvDefinition;
  ADMIN_SECURITY_TOKEN: ConfigEnvDefinition;
  GRPC_PROTO_DIR_BASE_PATH: ConfigEnvDefinition;
  GRPC_SERVICES_NAMES: ConfigEnvDefinition;
  COMPUTED: ConfigSyncResolverDefinition<[string], [string]>;
  DYNAMIC: ConfigAsyncResolverDefinition<undefined, number>;
} = {
  CADENCE_WEB_PORT: {
    env: 'CADENCE_WEB_PORT',
    //Fallback to nextjs default port if CADENCE_WEB_PORT is not provided
    default: '3000',
  },
  ADMIN_SECURITY_TOKEN: {
    env: 'CADENCE_ADMIN_SECURITY_TOKEN',
    default: '',
  },
  GRPC_PROTO_DIR_BASE_PATH: {
    env: 'GRPC_PROTO_DIR_BASE_PATH',
    default: 'src/__generated__/idl/proto',
  },
  GRPC_SERVICES_NAMES: {
    env: 'NEXT_PUBLIC_CADENCE_GRPC_SERVICES_NAMES',
    default: 'cadence-frontend',
  },
  // For testing purposes
  DYNAMIC: {
    resolver: async () => {
      return 1;
    },
  },
  COMPUTED: {
    resolver: (value: [string]) => {
      return value;
    },
  },
} as const;

export default dynamicConfigs;
