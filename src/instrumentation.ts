import getTransformedConfigs from './utils/config/get-transformed-configs';
import { setLoadedGlobalConfigs } from './utils/config/global-configs-ref';
import { registerLoggers } from './utils/logger';

export async function register() {
  registerLoggers();
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    setLoadedGlobalConfigs(getTransformedConfigs());
  }
}
