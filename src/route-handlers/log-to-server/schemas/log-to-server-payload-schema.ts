import { z } from 'zod';

import { LOG_LEVELS, type LogLevel } from '@/utils/logger';

const logToServerPayloadSchema = z.object({
  level: z.custom<LogLevel>((v) => LOG_LEVELS.includes(v)),
  message: z.string(),
  payload: z.any(),
});

export default logToServerPayloadSchema;
