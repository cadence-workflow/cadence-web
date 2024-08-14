import { type z } from 'zod';

import type logToServerPayloadSchema from './schemas/log-to-server-payload-schema';

export type LogToServerBody = z.infer<typeof logToServerPayloadSchema>;
