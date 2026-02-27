import { type GRPCClusterMethods } from '@/utils/grpc/grpc-client';
import { type GRPCMetadata } from '@/utils/grpc/grpc-service';

import authInfoMiddleware from '../middlewares/auth-info';
import { type AuthInfoMiddlewareContext } from '../middlewares/auth-info.types';
import grpcClusterMethodsMiddleware from '../middlewares/grpc-cluster-methods';
import grpcMetadataMiddleware from '../middlewares/grpc-metadata';
import userInfoMiddleware from '../middlewares/user-info';
import { type UserInfoMiddlewareContext } from '../middlewares/user-info.types';
import { type MiddlewareFunction } from '../route-handlers-middleware.types';

const routeHandlersDefaultMiddlewares: [
  MiddlewareFunction<['authInfo', AuthInfoMiddlewareContext]>,
  MiddlewareFunction<['userInfo', UserInfoMiddlewareContext]>,
  MiddlewareFunction<['grpcMetadata', GRPCMetadata | undefined]>,
  MiddlewareFunction<['grpcClusterMethods', GRPCClusterMethods]>,
] = [
  authInfoMiddleware,
  userInfoMiddleware,
  grpcMetadataMiddleware,
  grpcClusterMethodsMiddleware,
];

export default routeHandlersDefaultMiddlewares;
