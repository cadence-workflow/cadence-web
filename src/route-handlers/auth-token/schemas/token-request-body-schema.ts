import { z } from 'zod';

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

const tokenRequestBodySchema = z.object(
  {
    token: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? 'Token is required'
            : 'Token must be a string',
      })
      .transform((token) => token.trim().replace(/^bearer\s+/i, ''))
      .refine((token) => token.length > 0, {
        message: 'Token cannot be empty',
      })
      .refine((token) => JWT_PATTERN.test(token), {
        message: 'Token must be a JWT in header.payload.signature format',
      }),
  },
  {
    error: 'Request body must be a JSON object',
  }
);

export default tokenRequestBodySchema;
