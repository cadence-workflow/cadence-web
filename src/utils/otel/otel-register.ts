import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import logger from '@/utils/logger';

import { type OtelRegisterConfig } from './otel.types';

export async function register(config?: OtelRegisterConfig) {
  const { grpcInstrumentationConfig, ...sdkConfig } = config || {};
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'cadence-web',
    }),
    instrumentations: [
      new GrpcInstrumentation(grpcInstrumentationConfig),
      new HttpInstrumentation(),
      new UndiciInstrumentation(),
    ],
    textMapPropagator: new JaegerPropagator(),
    traceExporter: new OTLPTraceExporter(),
    ...sdkConfig,
  });
  try {
    await sdk.start();
  } catch (e) {
    logger.error({
      message: 'Failed to start OpenTelemetry SDK',
      error: e,
    });
  }
}
