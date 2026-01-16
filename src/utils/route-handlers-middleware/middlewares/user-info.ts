import {
  getGrpcMetadataFromAuth,
  resolveAuthContext,
} from '@/utils/auth/auth-context';

import isObjectOfStringKeyValue from '../helpers/is-object-of-string-key-value';
import { type MiddlewareFunction } from '../route-handlers-middleware.types';

import { type UserInfoMiddlewareContext } from './user-info.types';

const userInfo: MiddlewareFunction<
  ['userInfo', UserInfoMiddlewareContext]
> = async (request, _options, ctx) => {
  const authContext = await resolveAuthContext(request.cookies);

  const authMetadata = getGrpcMetadataFromAuth(authContext);
  if (authMetadata) {
    const existingMetadata = isObjectOfStringKeyValue(ctx.grpcMetadata)
      ? ctx.grpcMetadata
      : {};
    ctx.grpcMetadata = {
      ...existingMetadata,
      ...authMetadata,
    };
  }

  return ['userInfo', authContext];
};

export default userInfo;
