import { z } from 'zod';

const baseSchema = z.object({
  reason: z.string().min(1),
  skipSignalReapply: z.boolean().optional(),
  decisionFinishEventId: z.any().optional(),
  badBinaryFirstDecisionCompletedId: z.any().optional(),
});

const eventIdSchema = baseSchema.extend({
  resetType: z.literal('EventId'),
  decisionFinishEventId: z.string().min(1),
});

const badBinarySchema = baseSchema.extend({
  resetType: z.literal('BinaryChecksum'),
  badBinaryFirstDecisionCompletedId: z.string().min(1),
});

export const resetWorkflowFormSchema = z.discriminatedUnion('resetType', [
  eventIdSchema,
  badBinarySchema,
]);
