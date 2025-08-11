import queryString from 'query-string';

import { type GetConfigKeys } from '@/route-handlers/get-config/get-config.types';
import request from '@/utils/request';

import {
  type UseConfigQueryOptions,
  type UseConfigValueParams,
} from './use-config-value.types';

export default function getConfigValueQueryOptions<K extends GetConfigKeys>(
  params: UseConfigValueParams<K>
): UseConfigQueryOptions<K> {
  return {
    queryKey: [
      'dynamic_config',
      { configKey: params.key, jsonArgs: params.args },
    ] as const,
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
  };
}
