import { type ZodIssue } from 'zod';

export class RequestError extends Error {
  status: number;
  validationErrors: Array<ZodIssue> | undefined;
  constructor(
    message: string,
    status: number,
    validationErrors?: Array<ZodIssue>,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.status = status;
    if (validationErrors?.length) {
      this.validationErrors = validationErrors;
    }
    this.name = 'RequestError';
  }
}
