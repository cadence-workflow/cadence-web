import { createElement } from 'react';

import { type MetadataField } from '../domain-page-metadata/domain-page-metadata.types';
import DomainPageMetadataClusters from '../domain-page-metadata-clusters/domain-page-metadata-clusters';

const domainPageMetadataV2TableConfig = [
  {
    key: 'domainId',
    label: 'Domain ID',
    description: 'The UUID of the Cadence domain',
    kind: 'text',
    getValue: ({ domainDescription }) => domainDescription.id,
  },
  {
    key: 'description',
    label: 'Description',
    description: 'A short description of the domain',
    kind: 'custom',
    // TODO: create a Domain Description component that opens settings to edit
    getValue: ({ domainDescription }) =>
      createElement('div', {}, domainDescription.description),
  },
  {
    key: 'owner',
    label: 'Owner',
    description: 'E-mail of the domain owner',
    kind: 'text',
    getValue: ({ domainDescription }) =>
      domainDescription.ownerEmail || 'Unknown',
  },
  {
    key: 'clusters',
    label: 'Clusters',
    description: 'Clusters that the domain runs in',
    kind: 'custom',
    getValue: ({ domainDescription }) =>
      createElement(DomainPageMetadataClusters, domainDescription),
  },
  {
    key: 'globalOrLocal',
    label: 'Global/Local',
    description:
      'Whether the domain is global (operates in multiple clusters) or not',
    kind: 'text',
    getValue: ({ domainDescription }) =>
      domainDescription.isGlobalDomain ? 'Global' : 'Local',
  },
  {
    key: 'failoverVersion',
    label: 'Failover version',
    description: 'The failover version of the domain',
    kind: 'text',
    getValue: ({ domainDescription }) => domainDescription.failoverVersion,
  },
  {
    key: 'describeDomainJson',
    label: 'DescribeDomain response',
    description: 'View raw DescribeDomain response as JSON',
    kind: 'custom',
    // TODO: create a JSON modal component
    getValue: () => createElement('div', {}, 'Placeholder for JSON button'),
  },
] as const satisfies Array<MetadataField>;

export default domainPageMetadataV2TableConfig;
