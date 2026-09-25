import { getActiveAuthServerEntry } from '@/utils/auth/strategies/auth-server-registry';
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
    // Awaited: oidc's implementation decrypts the session cookie (async);
    // sync policies pass through await unchanged.
    await entry.policy.getGrpcMetadata(authContext, {
      cookies: request.cookies,
      headers: request.headers,
    }),
  ];
};

export default grpcMetadata;
