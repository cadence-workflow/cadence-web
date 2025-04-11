import { createElement } from 'react';

import { type MetadataField } from '../domain-page-metadata/domain-page-metadata.types';
import DomainPageMetadataClusters from '../domain-page-metadata-clusters/domain-page-metadata-clusters';

const domainPageMetadataV2TableConfig = [
  {
    key: 'domainId',
    label: 'Domain ID',
    kind: 'text',
    getValue: ({ domainDescription }) => domainDescription.id,
  },
  {
    key: 'description',
    label: 'Description',
    kind: 'custom',
    // TODO: create a Domain Description component that opens settings to edit
    getValue: ({ domainDescription }) =>
      createElement('div', {}, domainDescription.description),
  },
  {
    key: 'owner',
    label: 'Owner',
    kind: 'text',
    getValue: ({ domainDescription }) =>
      domainDescription.ownerEmail || 'Unknown',
  },
  {
    key: 'environment',
    label: 'Environment',
    kind: 'group',
    items: [
      {
        key: 'clusters',
        label: 'Clusters',
        kind: 'custom',
        getValue: ({ domainDescription }) =>
          createElement(DomainPageMetadataClusters, domainDescription),
      },
      {
        key: 'globalOrLocal',
        label: 'Global/Local',
        kind: 'text',
        getValue: ({ domainDescription }) =>
          domainDescription.isGlobalDomain ? 'Global' : 'Local',
      },
      {
        key: 'clusters2',
        label: 'Clusters (again)',
        kind: 'custom',
        getValue: ({ domainDescription }) =>
          createElement(DomainPageMetadataClusters, domainDescription),
      },
    ],
  },
  {
    key: 'failoverVersion',
    label: 'Failover version',
    kind: 'text',
    getValue: ({ domainDescription }) => domainDescription.failoverVersion,
  },
  {
    key: 'describeDomainJson',
    label: 'DescribeDomain response',
    kind: 'custom',
    // TODO: create a JSON modal component
    getValue: () => createElement('div', {}, 'Placeholder for JSON button'),
  },
] as const satisfies Array<MetadataField>;

export default domainPageMetadataV2TableConfig;
