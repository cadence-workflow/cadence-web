'use client';
import React from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import getConfigValueQueryOptions from '@/hooks/use-config-value/get-config-value-query-options';
import getDomainDescriptionQueryOptions from '@/views/shared/hooks/use-domain-description/get-domain-description-query-options';

import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import DomainPageMetadataTable from '../domain-page-metadata-table/domain-page-metadata-table';

import { type DomainMetadata } from './domain-page-metadata.types';

export default function DomainPageMetadata(props: DomainPageTabContentProps) {
  const [
    { data: domainDescription },
    {
      data: { metadata: isExtendedMetadataEnabled },
    },
  ] = useSuspenseQueries({
    queries: [
      getDomainDescriptionQueryOptions({
        domain: props.domain,
        cluster: props.cluster,
      }),
      getConfigValueQueryOptions({
        key: 'EXTENDED_DOMAIN_INFO_ENABLED',
        args: undefined,
      }),
    ],
  });

  const domainMetadata: DomainMetadata = {
    domainDescription,
    isExtendedMetadataEnabled,
  };

  return <DomainPageMetadataTable {...domainMetadata} />;
}
