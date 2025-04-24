import React from 'react';

import ListTable from '@/components/list-table/list-table';
import ListTableNested from '@/components/list-table-nested/list-table-nested';

import domainPageMetadataExtendedTableConfig from '../config/domain-page-metadata-extended-table.config';
import domainPageMetadataTableConfig from '../config/domain-page-metadata-table.config';
import { type DomainMetadata } from '../domain-page-metadata/domain-page-metadata.types';

import { styled } from './domain-page-metadata-table.styles';
import { type MetadataItem } from './domain-page-metadata-table.types';

export default function DomainPageMetadataTable(props: DomainMetadata) {
  return (
    <styled.MetadataContainer>
      {props.isExtendedMetadataEnabled ? (
        <ListTableNested
          items={domainPageMetadataExtendedTableConfig.map(
            (row: MetadataItem) => ({
              key: row.key,
              label: row.label,
              description: row.description,
              ...(row.kind === 'group'
                ? {
                    kind: 'group',
                    items: row.items.map((item) => ({
                      key: item.key,
                      label: item.label,
                      value: item.getValue(props),
                    })),
                  }
                : {
                    kind: 'simple',
                    value: row.getValue(props),
                  }),
            })
          )}
        />
      ) : (
        <ListTable
          data={props.domainDescription}
          listTableConfig={domainPageMetadataTableConfig}
        />
      )}
    </styled.MetadataContainer>
  );
}
