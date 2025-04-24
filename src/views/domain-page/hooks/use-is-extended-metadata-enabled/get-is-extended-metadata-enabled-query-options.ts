import { type UseQueryOptions } from '@tanstack/react-query';
import queryString from 'query-string';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

export default function getIsExtendedMetadataEnabledQueryOptions(): UseQueryOptions<
  GetConfigResponse<'EXTENDED_DOMAIN_INFO_ENABLED'>,
  RequestError,
  GetConfigResponse<'EXTENDED_DOMAIN_INFO_ENABLED'>,
  [string, { configKey: 'EXTENDED_DOMAIN_INFO_ENABLED' }]
> {
  return {
    queryKey: ['dynamic_config', { configKey: 'EXTENDED_DOMAIN_INFO_ENABLED' }],
    queryFn: ({
      queryKey: [_, { configKey }],
    }: {
      queryKey: [string, { configKey: 'EXTENDED_DOMAIN_INFO_ENABLED' }];
    }): Promise<GetConfigResponse<'EXTENDED_DOMAIN_INFO_ENABLED'>> =>
      request(
        queryString.stringifyUrl({
          url: '/api/config',
          query: {
            configKey,
          },
        })
      ).then((res) => res.json()),
  };
}
