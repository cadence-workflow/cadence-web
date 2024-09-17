import { z } from 'zod';

export const queryTypesDataSchema = z.string().transform((d): Array<string> => {
  const parsedJSON = JSON.parse(Buffer.from(d, 'base64').toString('utf-8'));
  return z.array(z.string()).parse(parsedJSON);
});
