'use client';
import React from 'react';

import useSuspenseDomainDescription from '@/views/shared/hooks/use-domain-description/use-suspense-domain-description';

import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import DomainPageMetadataTable from '../domain-page-metadata-table/domain-page-metadata-table';

export default function DomainPageMetadata(props: DomainPageTabContentProps) {
  const { data: domainDescription } = useSuspenseDomainDescription(props);

  return <DomainPageMetadataTable domainDescription={domainDescription} />;
}
