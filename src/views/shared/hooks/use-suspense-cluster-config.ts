'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import {
  type GetConfigRequestQuery,
  type GetConfigResponse,
} from '@/route-handlers/get-config/get-config.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

export default function useSuspenseClusterConfig() {
  return useSuspenseQuery<
    GetConfigResponse<'CLUSTERS_PUBLIC'>,
    RequestError,
    GetConfigResponse<'CLUSTERS_PUBLIC'>,
    [string, GetConfigRequestQuery<'CLUSTERS_PUBLIC'>]
  >({
    queryKey: [
      'dynamic_config',
      { configKey: 'CLUSTERS_PUBLIC', jsonArgs: undefined },
    ] as const,
    queryFn: ({ queryKey: [_, { configKey }] }) => {
      return request(`/api/config?configKey=${configKey}`, {
        method: 'GET',
      }).then((res) => res.json());
    },
  });
}
