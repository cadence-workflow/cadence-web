import { z } from 'zod';

// The batcher records progress in a HeartBeatDetails struct, surfaced on the
// batcher activity's heartbeat while the batch is running and returned as the
// workflow result on completion.
const heartbeatDetailsSchema = z
  .object({
    TotalEstimate: z.number(),
    SuccessCount: z.number().catch(0),
    ErrorCount: z.number().catch(0),
  })
  .transform(({ TotalEstimate, SuccessCount, ErrorCount }) => ({
    totalEstimate: TotalEstimate,
    successCount: SuccessCount,
    errorCount: ErrorCount,
  }));

export default heartbeatDetailsSchema;
