import { type UseQueryResult } from '@tanstack/react-query';

import {
  type GetConfigKeys,
  type GetConfigResponse,
} from '@/route-handlers/get-config/get-config.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseConfigValueResult<K extends GetConfigKeys> = UseQueryResult<
  GetConfigResponse<K>,
  RequestError
>;
