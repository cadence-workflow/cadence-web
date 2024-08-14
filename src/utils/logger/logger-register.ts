export async function registerLoggers() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await require('pino');
    await require('next-logger');
  }
}
