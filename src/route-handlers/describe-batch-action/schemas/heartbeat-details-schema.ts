import { z } from 'zod';

// The batcher records progress in a HeartBeatDetails struct, surfaced on the
// batcher activity's heartbeat while the batch is running and returned as the
// workflow result on completion.
const heartbeatDetailsSchema = z
  .object({
    TotalEstimate: z.number(),
    SuccessCount: z.number().catch(0),
    ErrorCount: z.number().catch(0),
    // Live, signal-tuned rate limit in effect for the running activity.
    // Optional so a batcher that predates the field still parses.
    RPS: z.number().optional().catch(undefined),
  })
  .transform(({ TotalEstimate, SuccessCount, ErrorCount, RPS }) => ({
    totalEstimate: TotalEstimate,
    successCount: SuccessCount,
    errorCount: ErrorCount,
    rps: RPS,
  }));

export default heartbeatDetailsSchema;
