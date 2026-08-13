import { z } from 'zod';

// Shared RPS validation used by both the new-batch-action draft form and the
// Edit RPS modal, so the two never drift.
export const rpsSchema = z
  .number()
  .int()
  .min(1, 'Must be between 1 and 999')
  .max(999, 'Must be between 1 and 999');
