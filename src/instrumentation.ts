import { registerLoggers } from './utils/logger';

export async function register() {
  registerLoggers();
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    (await import('./instrumentation.node')).register();
  }
}
