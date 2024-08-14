/*
  This file is a configuration file for the next-logger library,
  which patches Next's logger to output NDJSON to stdout using Pino.

  next-logger uses its own Pino logger by default, but for a unified logging
  experience, we pass a sibling logger that is configured similar to utils/logger.
*/

const {
  getNextLogger: logger,
} = async () => await import('./src/utils/logger')();

module.exports = {
  logger,
};
