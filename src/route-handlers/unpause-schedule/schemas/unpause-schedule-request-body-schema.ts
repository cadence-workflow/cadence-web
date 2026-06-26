import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { z } from 'zod';

const unpauseScheduleRequestBodySchema = z.object({
  reason: z.string().optional(),
  catchUpPolicy: z.nativeEnum(ScheduleCatchUpPolicy).optional(),
});

export default unpauseScheduleRequestBodySchema;
