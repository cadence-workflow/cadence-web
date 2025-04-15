'use client';
import React from 'react';

import ListTable from '@/components/list-table/list-table';
import ListTableNested from '@/components/list-table-nested/list-table-nested';

import domainPageMetadataTableConfig from '../config/domain-page-metadata-table.config';
import domainPageMetadataV2TableConfig from '../config/domain-page-metadata-v2-table.config';
import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import useSuspenseDomainPageMetadata from '../hooks/use-suspense-domain-page-metadata';

import { styled } from './domain-page-metadata.styles';
import { type MetadataItem } from './domain-page-metadata.types';

export default function DomainPageMetadata(props: DomainPageTabContentProps) {
  const domainMetadata = useSuspenseDomainPageMetadata({
    domain: props.domain,
    cluster: props.cluster,
  });

  return (
    <styled.MetadataContainer>
      {domainMetadata.isExtendedMetadataEnabled ? (
        <ListTableNested
          items={domainPageMetadataV2TableConfig.map((row: MetadataItem) => ({
            key: row.key,
            label: row.label,
            description: row.description,
            ...(row.kind === 'group'
              ? {
                  kind: 'group',
                  items: row.items.map((item) => ({
                    key: item.key,
                    label: item.label,
                    value: item.getValue(domainMetadata),
                  })),
                }
              : {
                  kind: 'simple',
                  value: row.getValue(domainMetadata),
                }),
          }))}
        />
      ) : (
        <ListTable
          data={domainMetadata.domainDescription}
          listTableConfig={domainPageMetadataTableConfig}
        />
      )}
    </styled.MetadataContainer>
  );
}
