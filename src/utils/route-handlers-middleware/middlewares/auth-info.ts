import { resolveAuthContext } from '@/utils/auth/auth-context';

import { type MiddlewareFunction } from '../route-handlers-middleware.types';

import { type AuthInfoMiddlewareContext } from './auth-info.types';

const authInfo: MiddlewareFunction<
  ['authInfo', AuthInfoMiddlewareContext]
> = async (request, _options, _ctx) => {
  const authContext = await resolveAuthContext(request.cookies);
  return ['authInfo', authContext];
};

export default authInfo;
