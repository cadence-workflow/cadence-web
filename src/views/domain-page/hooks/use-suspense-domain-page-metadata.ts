import { useSuspenseQueries } from '@tanstack/react-query';
import queryString from 'query-string';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';
import request from '@/utils/request';

import { type DomainDescription } from '../domain-page.types';

import {
  type DomainMetadata,
  type UseSuspenseDomainPageMetadataParams,
} from './use-suspense-domain-page-metadata.types';

export default function useSuspenseDomainPageMetadata(
  params: UseSuspenseDomainPageMetadataParams
): DomainMetadata {
  const [
    { data: domainDescription },
    {
      data: { metadata: isExtendedMetadataEnabled },
    },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['describeDomain', params],
        queryFn: async ({
          queryKey: [_, params],
        }: {
          queryKey: [string, UseSuspenseDomainPageMetadataParams];
        }): Promise<DomainDescription> =>
          request(`/api/domains/${params.domain}/${params.cluster}`).then(
            (res) => res.json()
          ),
      },
      {
        queryKey: [
          'dynamic_config',
          { configKey: 'EXTENDED_DOMAIN_INFO_ENABLED' },
        ],
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
      },
    ],
  });

  return {
    domainDescription,
    isExtendedMetadataEnabled,
  };
}
