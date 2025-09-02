import { type MiddlewareFunction } from '../route-handlers-middleware.types';

import { type UserInfoMiddlewareContext } from './user-info.types';

const userInfo: MiddlewareFunction<
  ['userInfo', UserInfoMiddlewareContext]
> = async () => {
  // Placeholder for user info middleware, to be implemented after integrating auth
  return ['userInfo', null];
};

export default userInfo;
