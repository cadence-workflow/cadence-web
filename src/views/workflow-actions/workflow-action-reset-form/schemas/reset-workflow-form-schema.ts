import { z } from 'zod';

const baseSchema = z.object({
  reason: z.string().min(1),
  skipSignalReapply: z.boolean().optional(),
});

const eventIdSchema = baseSchema.extend({
  resetType: z.literal('EventId'),
  decisionFinishEventId: z.string().min(1),
});

const binaryChecksumSchema = baseSchema.extend({
  resetType: z.literal('BinaryChecksum'),
  binaryChecksumFirstDecisionCompletedId: z.string().min(1),
});

export const resetWorkflowFormSchema = z.discriminatedUnion('resetType', [
  eventIdSchema,
  binaryChecksumSchema,
]);
