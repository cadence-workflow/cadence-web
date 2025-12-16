import {
  type UseQueryOptions,
  type UseQueryResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';

import {
  type GetConfigRequestQuery,
  type GetConfigArgs,
  type GetConfigKeys,
  type GetConfigResponse,
} from '@/route-handlers/get-config/get-config.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseConfigValueResult<K extends GetConfigKeys> = UseQueryResult<
  GetConfigResponse<K>,
  RequestError
>;

export type UseSuspenseConfigValueResult<K extends GetConfigKeys> =
  UseSuspenseQueryResult<GetConfigResponse<K>, RequestError>;

export type UseConfigValueParams<K extends GetConfigKeys> = {
  key: K;
  args: GetConfigArgs<K>;
};

export type UseConfigQueryOptions<K extends GetConfigKeys> = UseQueryOptions<
  GetConfigResponse<K>,
  RequestError,
  GetConfigResponse<K>,
  [string, GetConfigRequestQuery<K>]
>;
