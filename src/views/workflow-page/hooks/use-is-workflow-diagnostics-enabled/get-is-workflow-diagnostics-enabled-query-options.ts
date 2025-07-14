import { type UseQueryOptions } from '@tanstack/react-query';
import queryString from 'query-string';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

export default function getIsWorkflowDiagnosticsEnabledQueryOptions(): UseQueryOptions<
  GetConfigResponse<'WORKFLOW_DIAGNOSTICS_ENABLED'>,
  RequestError,
  GetConfigResponse<'WORKFLOW_DIAGNOSTICS_ENABLED'>,
  [string, { configKey: 'WORKFLOW_DIAGNOSTICS_ENABLED' }]
> {
  return {
    queryKey: ['dynamic_config', { configKey: 'WORKFLOW_DIAGNOSTICS_ENABLED' }],
    queryFn: ({
      queryKey: [_, { configKey }],
    }: {
      queryKey: [string, { configKey: 'WORKFLOW_DIAGNOSTICS_ENABLED' }];
    }): Promise<GetConfigResponse<'WORKFLOW_DIAGNOSTICS_ENABLED'>> =>
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
