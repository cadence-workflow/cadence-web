export class RequestError extends Error {
  status: number;
  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
    this.name = 'RequestError';
  }
}
