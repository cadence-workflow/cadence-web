import { z } from 'zod';

import { LOG_LEVELS, type LogLevel } from '@/utils/logger';

const logToServerPayloadSchema = z.object({
  level: z.custom<LogLevel>(
    (v) => LOG_LEVELS.some((level) => level === v),
    'Invalid log level: expected one of ' + LOG_LEVELS.toString()
  ),
  message: z.string(),
  payload: z.any().optional(),
});

export default logToServerPayloadSchema;
