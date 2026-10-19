import queryString from 'query-string';

import {
  type GetConfigKeys,
  type GetConfigRequestQuery,
} from '@/route-handlers/get-config/get-config.types';
import request from '@/utils/request';

import {
  type UseConfigQueryOptions,
  type UseConfigValueParams,
  type UseSuspenseConfigQueryOptions,
} from './use-config-value.types';

function buildConfigValueQueryOptions<K extends GetConfigKeys>(
  params: UseConfigValueParams<K>
): UseConfigQueryOptions<K> {
  return {
    queryKey: [
      'dynamic_config',
      { configKey: params.key, jsonArgs: params.args },
    ],
    queryFn: ({
      queryKey: [_, { configKey, jsonArgs }],
    }: {
      queryKey: [string, GetConfigRequestQuery<K>];
    }) =>
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

export default function getConfigValueQueryOptions<K extends GetConfigKeys>(
  params: UseConfigValueParams<K>
): UseConfigQueryOptions<K> {
  return buildConfigValueQueryOptions(params);
}

export function getConfigValueSuspenseQueryOptions<K extends GetConfigKeys>(
  params: UseConfigValueParams<K>
): UseSuspenseConfigQueryOptions<K> {
  // Same shape as the non-suspense helper; suspense options omit skipToken from queryFn.
  return buildConfigValueQueryOptions(
    params
  ) as UseSuspenseConfigQueryOptions<K>;
}
