import { z } from 'zod';

const validQueryInputSchema = z.string().superRefine((str, ctx) => {
  if (str === '') return true;

  try {
    return JSON.parse(str);
  } catch {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
    return z.NEVER;
  }
});

export default validQueryInputSchema;
