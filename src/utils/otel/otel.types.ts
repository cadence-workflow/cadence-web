import { type GrpcInstrumentationConfig } from '@opentelemetry/instrumentation-grpc';
import { type NodeSDKConfiguration } from '@opentelemetry/sdk-node';

export type OtelRegisterConfig = Partial<NodeSDKConfiguration> & {
  grpcInstrumentationConfig?: GrpcInstrumentationConfig;
};
