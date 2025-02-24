import { type ZodIssue } from 'zod';

export class RequestError extends Error {
  url: string;
  status: number;
  validationErrors: Array<ZodIssue> | undefined;
  constructor(
    message: string,
    url: string,
    status: number,
    validationErrors?: Array<ZodIssue>,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.url = url;
    this.status = status;
    if (validationErrors?.length) {
      this.validationErrors = validationErrors;
    }
    this.name = 'RequestError';
  }
}
