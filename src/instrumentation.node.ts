import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { registerOTel } from '@vercel/otel';

import getTransformedConfigs from './utils/config/get-transformed-configs';
import { setLoadedGlobalConfigs } from './utils/config/global-configs-ref';
import logger from './utils/logger';

export async function register() {
  registerOTel({
    serviceName: 'cadence-web',
    instrumentations: [
      new GrpcInstrumentation(),
      new HttpInstrumentation(),
      new UndiciInstrumentation(),
    ],
    propagators:
      process.env.OTEL_PROPAGATORS?.trim() === 'jeager'
        ? [new JaegerPropagator()]
        : undefined,
  });
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
