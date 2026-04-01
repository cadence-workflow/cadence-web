import { getGrpcMetadataFromAuth } from '@/utils/auth/auth-context';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import { type MiddlewareFunction } from '../route-handlers-middleware.types';

import { type AuthInfoMiddlewareContext } from './auth-info.types';

const grpcMetadata: MiddlewareFunction<
  ['grpcMetadata', GRPCMetadata | undefined]
> = (_request, _options, ctx) => {
  const authContext = ctx.authInfo as AuthInfoMiddlewareContext | undefined;
  return ['grpcMetadata', getGrpcMetadataFromAuth(authContext)];
};

export default grpcMetadata;
