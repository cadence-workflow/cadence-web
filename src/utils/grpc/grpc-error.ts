import * as grpc from '@grpc/grpc-js';
import { type Status } from '@grpc/grpc-js/build/src/constants';
import isError from 'lodash/isError';

const GRPC_ERROR_STATUS_TO_HTTP_ERROR_CODE_MAP: { [index: string]: number } = {
  [grpc.status.INVALID_ARGUMENT]: 400,
  [grpc.status.OUT_OF_RANGE]: 400,
  [grpc.status.FAILED_PRECONDITION]: 400,
  [grpc.status.UNAUTHENTICATED]: 401,
  [grpc.status.PERMISSION_DENIED]: 403,
  [grpc.status.NOT_FOUND]: 404,
  [grpc.status.UNIMPLEMENTED]: 404,
  [grpc.status.ALREADY_EXISTS]: 409,
  [grpc.status.RESOURCE_EXHAUSTED]: 429,
  [grpc.status.UNAVAILABLE]: 503,
  [grpc.status.DEADLINE_EXCEEDED]: 504,
};

export class GRPCError extends Error {
  grpcStatusCode: Status;
  httpStatusCode: number;
  constructor(
    message: string,
    options?: ErrorOptions & { grpcStatusCode?: Status }
  ) {
    super(message, options);
    this.grpcStatusCode = options?.grpcStatusCode ?? grpc.status.UNKNOWN;
    this.httpStatusCode =
      GRPC_ERROR_STATUS_TO_HTTP_ERROR_CODE_MAP[this.grpcStatusCode];
    this.name = 'GRPCError';
  }
}

export type GRPCInputError = Error & {
  details?: string;
  message?: string;
  code?: number;
};

export function isGRPCError(e: unknown): e is GRPCError {
  return isError(e) && e.name === 'GRPCError';
}

export function getHTTPStatusCode(error: unknown) {
  if (isGRPCError(error)) {
    return error.httpStatusCode || 500;
  }
  return 500;
}
