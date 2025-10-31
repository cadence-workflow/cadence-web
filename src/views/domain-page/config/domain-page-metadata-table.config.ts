import { createElement } from 'react';

import type { ListTableItem } from '@/components/list-table/list-table.types';
import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import DomainPageMetadataClusters from '../domain-page-metadata-clusters/domain-page-metadata-clusters';
import DomainPageMetadataFailoverVersionActiveActive from '../domain-page-metadata-failover-version-active-active/domain-page-metadata-failover-version-active-active';
import { type DomainDescription } from '../domain-page.types';
import getClusterOperationMode from '../helpers/get-cluster-operation-mode';

const domainPageMetadataTableConfig: Array<ListTableItem<DomainDescription>> = [
  {
    key: 'domainId',
    label: 'Domain ID',
    renderValue: (domainDescription: DomainDescription) => domainDescription.id,
  },
  {
    key: 'owner',
    label: 'Owner',
    renderValue: (domainDescription: DomainDescription) =>
      domainDescription.ownerEmail,
  },
  {
    key: 'clusters',
    label: 'Clusters',
    renderValue: DomainPageMetadataClusters,
  },
  {
    key: 'mode',
    label: 'Mode',
    renderValue: (domainDescription: DomainDescription) =>
      getClusterOperationMode(domainDescription),
  },
  {
    key: 'failoverVersion',
    label: 'Failover version',
    renderValue: (domainDescription: DomainDescription) =>
      isActiveActiveDomain(domainDescription)
        ? createElement(
            DomainPageMetadataFailoverVersionActiveActive,
            domainDescription
          )
        : domainDescription.failoverVersion,
  },
];

export default domainPageMetadataTableConfig;
