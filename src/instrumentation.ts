import { type Instrumentation } from '@opentelemetry/instrumentation';

import getTransformedConfigs from './utils/config/get-transformed-configs';
import { setLoadedGlobalConfigs } from './utils/config/global-configs-ref';

export async function register() {
  let instrumentations: (Instrumentation | Instrumentation[])[] = [];
  // register instrumentations before any other code is executed
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.OTEL_SDK_DISABLED === 'false'
  ) {
    instrumentations = (
      await import('@/utils/otel/otel-register-instrumentations')
    ).otelRegisterInstrumentations({});
  }

  // import/register loggers after instrumentations are registered to have instrumented pino along with logs correlation
  const { registerLoggers, default: logger } = await import('@/utils/logger');
  registerLoggers();

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.OTEL_SDK_DISABLED === 'false') {
      await (
        await import('@/utils/otel/otel-register')
      ).otelRegister({
        instrumentations,
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
}
