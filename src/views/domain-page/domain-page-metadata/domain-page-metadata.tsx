'use client';
import React from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import getDomainDescriptionQueryOptions from '@/views/shared/hooks/use-domain-description/get-domain-description-query-options';

import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import DomainPageMetadataTable from '../domain-page-metadata-table/domain-page-metadata-table';
import getIsExtendedMetadataEnabledQueryOptions from '../hooks/use-is-extended-metadata-enabled/get-is-extended-metadata-enabled-query-options';

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
      getIsExtendedMetadataEnabledQueryOptions(),
    ],
  });

  const domainMetadata: DomainMetadata = {
    domainDescription,
    isExtendedMetadataEnabled,
  };

  return <DomainPageMetadataTable {...domainMetadata} />;
}
