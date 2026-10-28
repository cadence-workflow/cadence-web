import { status } from '@grpc/grpc-js';

import { getHTTPStatusCode, GRPCError, isGRPCError } from '../grpc-error';

describe(isGRPCError.name, () => {
  it('returns true for a GRPCError', () => {
    expect(isGRPCError(new GRPCError('mock error'))).toBe(true);
  });

  it('returns true for a GRPCError from another copy of the module', () => {
    expect(isGRPCError(getForeignGRPCError())).toBe(true);
  });

  it('returns false for another error', () => {
    expect(isGRPCError(new Error('mock error'))).toBe(false);
  });

  it('returns false for a value that is not an error', () => {
    expect(isGRPCError({ name: 'GRPCError', message: 'mock error' })).toBe(
      false
    );
  });
});

describe(getHTTPStatusCode.name, () => {
  it('returns the HTTP status code of a GRPCError', () => {
    expect(
      getHTTPStatusCode(
        new GRPCError('mock error', { grpcStatusCode: status.NOT_FOUND })
      )
    ).toBe(404);
  });

  it('returns the HTTP status code of a GRPCError from another copy of the module', () => {
    expect(getHTTPStatusCode(getForeignGRPCError())).toBe(404);
  });

  it('returns 500 for a GRPCError without a mapped status code', () => {
    expect(getHTTPStatusCode(new GRPCError('mock error'))).toBe(500);
  });

  it('returns 500 for another error', () => {
    expect(getHTTPStatusCode(new Error('mock error'))).toBe(500);
  });
});

function getForeignGRPCError() {
  const error = Object.assign(new Error('mock error'), {
    grpcStatusCode: status.NOT_FOUND,
    httpStatusCode: 404,
  });
  error.name = 'GRPCError';
  return error;
}
