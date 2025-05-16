import { z } from 'zod';

import losslessJsonParse from '@/utils/lossless-json-parse';

const signalWorkflowInputSchema = z.string().superRefine((str, ctx) => {
  if (!str) return undefined;

  try {
    return losslessJsonParse(str);
  } catch {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
    return z.NEVER;
  }
});

export default signalWorkflowInputSchema;
