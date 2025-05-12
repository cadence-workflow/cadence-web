import logger, { registerLoggers } from '@/utils/logger';

import getTransformedConfigs from './utils/config/get-transformed-configs';
import { setLoadedGlobalConfigs } from './utils/config/global-configs-ref';

export async function register() {
  registerLoggers();

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.OTEL_SDK_DISABLED === 'false') {
      (await import('@/utils/otel/otel-register')).register();
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
