import { getGrpcMetadataFromAuth } from '@/utils/auth/auth-context';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import isObjectOfStringKeyValue from '../helpers/is-object-of-string-key-value';
import { type MiddlewareFunction } from '../route-handlers-middleware.types';

import { type AuthInfoMiddlewareContext } from './auth-info.types';

const grpcMetadata: MiddlewareFunction<
  ['grpcMetadata', GRPCMetadata | undefined]
> = (_request, _options, ctx) => {
  const authContext = ctx.authInfo as AuthInfoMiddlewareContext | undefined;
  const authMetadata = getGrpcMetadataFromAuth(authContext);
  const existingMetadata = isObjectOfStringKeyValue(ctx.grpcMetadata)
    ? ctx.grpcMetadata
    : undefined;

  if (!authMetadata && !existingMetadata) {
    return ['grpcMetadata', undefined];
  }

  return [
    'grpcMetadata',
    {
      ...(existingMetadata ?? {}),
      ...(authMetadata ?? {}),
    },
  ];
};

export default grpcMetadata;
