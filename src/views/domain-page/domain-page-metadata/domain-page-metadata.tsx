'use client';
import React from 'react';

import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import DomainPageMetadataTable from '../domain-page-metadata-table/domain-page-metadata-table';
import useSuspenseDomainPageMetadata from '../hooks/use-suspense-domain-page-metadata';

export default function DomainPageMetadata(props: DomainPageTabContentProps) {
  const domainMetadata = useSuspenseDomainPageMetadata({
    domain: props.domain,
    cluster: props.cluster,
  });

  return <DomainPageMetadataTable {...domainMetadata} />;
}
