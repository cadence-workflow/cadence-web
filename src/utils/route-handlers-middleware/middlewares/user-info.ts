import { type MiddlewareFunction } from '../route-handlers-middleware.types';

import { type AuthInfoMiddlewareContext } from './auth-info.types';
import { type UserInfoMiddlewareContext } from './user-info.types';

const userInfo: MiddlewareFunction<
  ['userInfo', UserInfoMiddlewareContext]
> = async (_request, _options, ctx) => {
  const authContext = ctx.authInfo as AuthInfoMiddlewareContext | undefined;
  const userInfo =
    authContext?.id || authContext?.userName
      ? { id: authContext?.id, userName: authContext?.userName }
      : undefined;

  return ['userInfo', userInfo];
};

export default userInfo;
