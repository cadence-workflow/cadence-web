import { useQuery } from '@tanstack/react-query';
import queryString from 'query-string';

import {
  type GetConfigResponse,
  type GetConfigArgs,
  type GetConfigKeys,
  type GetConfigKeysWithArgs,
  type GetConfigKeysWithoutArgs,
  type GetConfigRequestQuery,
} from '@/route-handlers/get-config/get-config.types';
import logger from '@/utils/logger';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { type UseConfigValueResult } from './use-config-value.types';

export default function useConfigValue<K extends GetConfigKeysWithArgs>(
  key: K,
  args: GetConfigArgs<K>
): UseConfigValueResult<K>;

export default function useConfigValue<K extends GetConfigKeysWithoutArgs>(
  key: K
): UseConfigValueResult<K>;

export default function useConfigValue<K extends GetConfigKeys>(
  key: K,
  args?: GetConfigArgs<K>
): UseConfigValueResult<K> {
  const queryResult = useQuery<
    GetConfigResponse<K>,
    RequestError,
    GetConfigResponse<K>,
    [string, GetConfigRequestQuery<K>]
  >({
    queryKey: ['dynamic_config', { configKey: key, jsonArgs: args }] as const,
    queryFn: ({ queryKey: [_, { configKey, jsonArgs }] }) =>
      request(
        queryString.stringifyUrl({
          url: '/api/config',
          query: {
            configKey,
            jsonArgs: JSON.stringify(jsonArgs),
          },
        }),
        {
          method: 'GET',
        }
      ).then((res) => res.json()),
  });

  if (queryResult.error) {
    logger.error(
      { key, args, error: queryResult.error },
      'Error fetching dynamic config value'
    );
  }

  return queryResult;
}
