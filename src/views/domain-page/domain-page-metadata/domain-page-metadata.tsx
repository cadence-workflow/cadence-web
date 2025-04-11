'use client';
import React from 'react';

import ListTable from '@/components/list-table/list-table';
import ListTableV2 from '@/components/list-table-v2/list-table-v2';

import domainPageMetadataTableConfig from '../config/domain-page-metadata-table.config';
import domainPageMetadataV2TableConfig from '../config/domain-page-metadata-v2-table.config';
import { type DomainPageTabContentProps } from '../domain-page-content/domain-page-content.types';
import useSuspenseDomainPageMetadata from '../hooks/use-suspense-domain-page-metadata';

import { styled } from './domain-page-metadata.styles';
import { type MetadataField } from './domain-page-metadata.types';

export default function DomainPageMetadata(props: DomainPageTabContentProps) {
  const { domainDescription, isExtendedMetadataEnabled } =
    useSuspenseDomainPageMetadata({
      domain: props.domain,
      cluster: props.cluster,
    });

  return (
    <styled.MetadataContainer>
      {isExtendedMetadataEnabled ? (
        <ListTableV2
          items={domainPageMetadataV2TableConfig.map((row: MetadataField) => ({
            key: row.key,
            label: row.label,
            description: row.description,
            ...(row.kind === 'group'
              ? {
                  kind: 'group',
                  items: row.items.map((item) => ({
                    key: item.key,
                    label: item.label,
                    value: item.getValue({ domainDescription }),
                  })),
                }
              : {
                  kind: 'simple',
                  value: row.getValue({ domainDescription }),
                }),
          }))}
        />
      ) : (
        <ListTable
          data={domainDescription}
          listTableConfig={domainPageMetadataTableConfig}
        />
      )}
    </styled.MetadataContainer>
  );
}
