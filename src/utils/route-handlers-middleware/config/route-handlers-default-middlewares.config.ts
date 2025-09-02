import { type GRPCClusterMethods } from '@/utils/grpc/grpc-client';

import grpcClusterMethodsMiddleware from '../middlewares/grpc-cluster-methods';
import userInfoMiddleware from '../middlewares/user-info';
import { type UserInfoMiddlewareContext } from '../middlewares/user-info.types';
import { type MiddlewareFunction } from '../route-handlers-middleware.types';

const routeHandlersDefaultMiddlewares: [
  MiddlewareFunction<['grpcClusterMethods', GRPCClusterMethods]>,
  MiddlewareFunction<['userInfo', UserInfoMiddlewareContext]>,
] = [grpcClusterMethodsMiddleware, userInfoMiddleware];

export default routeHandlersDefaultMiddlewares;
