import SublistTable from '@/components/list-table-nested/sublist-table/sublist-table';
import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import { type DomainDescription } from '../domain-page.types';

export default function DomainPageMetadataFailoverVersion(
  domainDescription: DomainDescription
) {
  if (isActiveActiveDomain(domainDescription)) {
    return (
      <SublistTable
        items={Object.values(domainDescription.activeClusters.regionToCluster)
          .sort(
            (
              { activeClusterName: clusterA },
              { activeClusterName: clusterB }
            ) => (clusterA > clusterB ? 1 : -1)
          )
          .map(({ activeClusterName, failoverVersion }) => ({
            key: activeClusterName,
            label: activeClusterName,
            value: failoverVersion,
          }))}
      />
    );
  }

  return domainDescription.failoverVersion;
}
