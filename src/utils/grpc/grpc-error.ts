import * as grpc from '@grpc/grpc-js';
import { type Status } from '@grpc/grpc-js/build/src/constants';

const GRPC_ERROR_STATUS_TO_HTTP_ERROR_CODE_MAP: { [index: string]: number } = {
  [grpc.status.INVALID_ARGUMENT]: 400,
  [grpc.status.OUT_OF_RANGE]: 400,
  [grpc.status.FAILED_PRECONDITION]: 400,
  [grpc.status.UNAUTHENTICATED]: 401,
  [grpc.status.PERMISSION_DENIED]: 403,
  [grpc.status.NOT_FOUND]: 404,
  [grpc.status.UNIMPLEMENTED]: 404,
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

export function getHTTPStatusCode(error: unknown) {
  if (error instanceof GRPCError) {
    return error.httpStatusCode;
  }
  return 500;
}
