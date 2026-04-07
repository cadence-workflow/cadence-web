import { type MiddlewareFunction } from '../route-handlers-middleware.types';

import { type AuthInfoMiddlewareContext } from './auth-info.types';
import { type UserInfoMiddlewareContext } from './user-info.types';

const userInfo: MiddlewareFunction<['userInfo', UserInfoMiddlewareContext]> = (
  _request,
  _options,
  ctx
) => {
  const authContext = ctx.authInfo as AuthInfoMiddlewareContext | undefined;
  const id = authContext?.id;

  if (!id) {
    return ['userInfo', null];
  }

  return ['userInfo', { id, userName: authContext?.userName }];
};

export default userInfo;
