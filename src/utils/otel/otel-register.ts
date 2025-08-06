import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import logger from '@/utils/logger';

import { type OtelRegisterConfig } from './otel.types';

export async function otelRegister(config?: OtelRegisterConfig) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'cadence-web',
    }),
    textMapPropagator: new JaegerPropagator(),
    traceExporter: new OTLPTraceExporter(),
    ...config,
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
