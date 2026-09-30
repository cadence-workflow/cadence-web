import getActiveAuthServerEntry from '@/utils/auth/strategies/get-active-auth-server-entry';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import { type MiddlewareFunction } from '../route-handlers-middleware.types';

import { type AuthInfoMiddlewareContext } from './auth-info.types';

const grpcMetadata: MiddlewareFunction<
  ['grpcMetadata', GRPCMetadata | undefined]
> = async (request, _options, ctx) => {
  const authContext = ctx.authInfo as AuthInfoMiddlewareContext | undefined;
  if (!authContext) {
    return ['grpcMetadata', undefined];
  }
  const entry = await getActiveAuthServerEntry();
  return [
    'grpcMetadata',
    await entry.policy.getGrpcMetadata(authContext, {
      cookies: request.cookies,
      headers: request.headers,
    }),
  ];
};

export default grpcMetadata;
