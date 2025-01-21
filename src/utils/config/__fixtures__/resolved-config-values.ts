import { type LoadedConfigResolvedValues } from '../config.types';

const mockResolvedConfigValues: LoadedConfigResolvedValues = {
  DYNAMIC: 2,
  ADMIN_SECURITY_TOKEN: 'mock-secret',
  CADENCE_WEB_PORT: '3000',
  COMPUTED: ['mock-computed'],
  COMPUTED_WITH_ARG: ['mock-arg'],
  DYNAMIC_WITH_ARG: 5,
  GRPC_PROTO_DIR_BASE_PATH: 'mock/path/to/grpc/proto',
  GRPC_SERVICES_NAMES: 'mock-grpc-service-name',
};
export default mockResolvedConfigValues;
