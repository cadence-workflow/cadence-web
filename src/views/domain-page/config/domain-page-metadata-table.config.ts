import type { ListTableItem } from '@/components/list-table/list-table.types';

import DomainPageMetadataClusters from '../domain-page-metadata-clusters/domain-page-metadata-clusters';
import { type DomainDescription } from '../domain-page.types';

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
    key: 'globalOrLocal',
    label: 'Global/Local',
    renderValue: (domainDescription: DomainDescription) =>
      domainDescription.isGlobalDomain ? 'Global' : 'Local',
  },
  {
    key: 'failoverVersion',
    label: 'Failover version',
    renderValue: (domainDescription: DomainDescription) =>
      domainDescription.failoverVersion,
  },
];

export default domainPageMetadataTableConfig;
