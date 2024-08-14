import { pino } from 'pino';

import LOGGER_CONFIG from './pino.config';
import { type CustomLevels } from './pino.types';

const logger = pino<CustomLevels>(LOGGER_CONFIG);

export default logger;
