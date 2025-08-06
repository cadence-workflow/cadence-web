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
  UndiciInstrumentation,
  type UndiciInstrumentationConfig,
} from '@opentelemetry/instrumentation-undici';

export function otelRegisterInstrumentations({
  grpcInstrumentationConfig,
  httpInstrumentationConfig,
  undiciInstrumentationConfig,
  pinoInstrumentationConfig,
}: {
  grpcInstrumentationConfig?: GrpcInstrumentationConfig;
  httpInstrumentationConfig?: HttpInstrumentationConfig;
  undiciInstrumentationConfig?: UndiciInstrumentationConfig;
  pinoInstrumentationConfig?: PinoInstrumentationConfig;
} = {}) {
  return [
    new GrpcInstrumentation(grpcInstrumentationConfig),
    new HttpInstrumentation(httpInstrumentationConfig),
    new UndiciInstrumentation(undiciInstrumentationConfig),
    new PinoInstrumentation(pinoInstrumentationConfig),
  ];
}
