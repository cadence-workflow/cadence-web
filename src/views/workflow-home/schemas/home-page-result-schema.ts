import { z } from 'zod';

// An invalid field is dropped on its own, so it does not hide the other fields
const optionalText = z.string().trim().min(1).optional().catch(undefined);

const homePageResultSchema = z.object({
  cadenceResponseType: z.literal('formattedData'),
  format: z.literal('text/markdown'),
  data: z.string(),
  title: optionalText,
  badgeName: optionalText,
});

export default homePageResultSchema;
