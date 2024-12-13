export class UseMergedInfiniteQueriesError extends Error {
  errors: Array<Error>;
  constructor(message: string, errors: Array<Error>, options?: ErrorOptions) {
    super(message, options);
    this.errors = errors;
    this.name = 'UseMergedInfiniteQueriesError';
  }
}
