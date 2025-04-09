'use client';
import React from 'react';

import ListTable from '@/components/list-table/list-table';

import domainPageMetadataTableConfig from '../config/domain-page-metadata-table.config';
import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import useDomainPageMetadata from '../hooks/use-domain-page-metadata';

import { styled } from './domain-page-metadata.styles';

export default function DomainPageMetadata(props: DomainPageTabContentProps) {
  const { domainDescription } = useDomainPageMetadata({
    domain: props.domain,
    cluster: props.cluster,
  });

  return (
    <styled.MetadataContainer>
      <ListTable
        data={domainDescription}
        listTableConfig={domainPageMetadataTableConfig}
      />
    </styled.MetadataContainer>
  );
}
