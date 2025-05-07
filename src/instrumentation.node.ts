import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import getTransformedConfigs from './utils/config/get-transformed-configs';
import { setLoadedGlobalConfigs } from './utils/config/global-configs-ref';
import logger from './utils/logger';
export async function register() {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'cadence-web',
    }),
    instrumentations: [
      new GrpcInstrumentation(),
      new HttpInstrumentation(),
      new UndiciInstrumentation(),
    ],
    propagators: [new JaegerPropagator()],
    traceExporter: new OTLPTraceExporter({
      url: 'http://localhost:24317',
    }),
  });
  try {
    await sdk.start();
  } catch (e) {
    logger.error({
      message: 'Failed to start OpenTelemetry SDK',
      error: e,
    });
  }

  try {
    const configs = await getTransformedConfigs();
    setLoadedGlobalConfigs(configs);
  } catch (e) {
    // manually catching and logging the error to prevent the error being replaced
    // by "Cannot set property message of [object Object] which has only a getter"
    logger.error({
      message: 'Failed to load configs',
      error: e,
    });
    process.exit(1); // use process.exit to exit without an extra error log from instrumentation
  }
}
