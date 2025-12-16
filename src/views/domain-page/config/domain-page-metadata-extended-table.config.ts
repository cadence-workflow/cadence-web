import { createElement } from 'react';

import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import DomainPageMetadataClusters from '../domain-page-metadata-clusters/domain-page-metadata-clusters';
import DomainPageMetadataDescription from '../domain-page-metadata-description/domain-page-metadata-description';
import DomainPageMetadataFailoverVersionActiveActive from '../domain-page-metadata-failover-version-active-active/domain-page-metadata-failover-version-active-active';
import { type MetadataItem } from '../domain-page-metadata-table/domain-page-metadata-table.types';
import DomainPageMetadataViewJson from '../domain-page-metadata-view-json/domain-page-metadata-view-json';
import getClusterOperationMode from '../helpers/get-cluster-operation-mode';

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
    key: 'mode',
    label: 'Mode',
    description: 'Domain operation mode in multi-cluster setup',
    kind: 'simple',
    getValue: ({ domainDescription }) =>
      getClusterOperationMode(domainDescription),
  },
  {
    key: 'failoverVersion',
    label: 'Failover version',
    description: 'The failover version of the domain',
    kind: 'simple',
    getValue: ({ domainDescription }) =>
      isActiveActiveDomain(domainDescription)
        ? createElement(
            DomainPageMetadataFailoverVersionActiveActive,
            domainDescription
          )
        : domainDescription.failoverVersion,
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
