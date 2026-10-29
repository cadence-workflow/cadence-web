import { z } from 'zod';

import losslessJsonParse from '@/utils/lossless-json-parse';

const signalWorkflowInputSchema = z.string().superRefine((str, ctx) => {
  if (!str) return;

  try {
    losslessJsonParse(str);
  } catch {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
  }
});

export default signalWorkflowInputSchema;
