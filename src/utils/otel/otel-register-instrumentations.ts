import {
  GrpcInstrumentation,
  type GrpcInstrumentationConfig,
} from '@opentelemetry/instrumentation-grpc';
import {
  HttpInstrumentation,
  type HttpInstrumentationConfig,
} from '@opentelemetry/instrumentation-http';
import {
  PinoInstrumentation,
  type PinoInstrumentationConfig,
} from '@opentelemetry/instrumentation-pino';
import {
  RuntimeNodeInstrumentation,
  type RuntimeNodeInstrumentationConfig,
} from '@opentelemetry/instrumentation-runtime-node';
import {
  UndiciInstrumentation,
  type UndiciInstrumentationConfig,
} from '@opentelemetry/instrumentation-undici';

export function otelRegisterInstrumentations({
  grpcInstrumentationConfig,
  httpInstrumentationConfig,
  undiciInstrumentationConfig,
  pinoInstrumentationConfig,
  runtimeNodeInstrumentationConfig,
}: {
  grpcInstrumentationConfig?: GrpcInstrumentationConfig;
  httpInstrumentationConfig?: HttpInstrumentationConfig;
  undiciInstrumentationConfig?: UndiciInstrumentationConfig;
  pinoInstrumentationConfig?: PinoInstrumentationConfig;
  runtimeNodeInstrumentationConfig?: RuntimeNodeInstrumentationConfig;
} = {}) {
  return [
    new GrpcInstrumentation(grpcInstrumentationConfig),
    new HttpInstrumentation(httpInstrumentationConfig),
    new UndiciInstrumentation(undiciInstrumentationConfig),
    new PinoInstrumentation(pinoInstrumentationConfig),
    new RuntimeNodeInstrumentation(runtimeNodeInstrumentationConfig),
  ];
}
