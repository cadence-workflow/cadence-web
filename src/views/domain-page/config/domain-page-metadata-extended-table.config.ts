import { createElement } from 'react';

import { type MetadataItem } from '../domain-page-metadata/domain-page-metadata.types';
import DomainPageMetadataClusters from '../domain-page-metadata-clusters/domain-page-metadata-clusters';
import DomainPageMetadataDescription from '../domain-page-metadata-description/domain-page-metadata-description';
import DomainPageMetadataViewJson from '../domain-page-metadata-view-json/domain-page-metadata-view-json';

const domainPageMetadataExtendedTableConfig = [
  {
    key: 'domainId',
    label: 'Domain ID',
    description: 'The UUID of the Cadence domain',
    kind: 'simple',
    getValue: ({ domainDescription }) => domainDescription.id,
  },
  {
    key: 'description',
    label: 'Description',
    description: 'Brief, high-level description of the Cadence domain',
    kind: 'simple',
    getValue: ({ domainDescription }) =>
      createElement(DomainPageMetadataDescription, {
        description: domainDescription.description,
      }),
  },
  {
    key: 'owner',
    label: 'Owner',
    description: 'E-mail of the domain owner',
    kind: 'simple',
    getValue: ({ domainDescription }) =>
      domainDescription.ownerEmail || 'Unknown',
  },
  {
    key: 'clusters',
    label: 'Clusters',
    description: 'Clusters that the domain runs in',
    kind: 'simple',
    getValue: ({ domainDescription }) =>
      createElement(DomainPageMetadataClusters, domainDescription),
  },
  {
    key: 'globalOrLocal',
    label: 'Global/Local',
    description:
      'Whether the domain is global (operates in multiple clusters) or not',
    kind: 'simple',
    getValue: ({ domainDescription }) =>
      domainDescription.isGlobalDomain ? 'Global' : 'Local',
  },
  {
    key: 'failoverVersion',
    label: 'Failover version',
    description: 'The failover version of the domain',
    kind: 'simple',
    getValue: ({ domainDescription }) => domainDescription.failoverVersion,
  },
  {
    key: 'describeDomainJson',
    label: 'DescribeDomain response',
    description: 'View raw DescribeDomain response as JSON',
    kind: 'simple',
    getValue: ({ domainDescription }) =>
      createElement(DomainPageMetadataViewJson, { domainDescription }),
  },
] as const satisfies Array<MetadataItem>;

export default domainPageMetadataExtendedTableConfig;
