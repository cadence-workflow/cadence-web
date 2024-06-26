import React from 'react';

import LinkBlack from '@/components/link-black/link-black';

import { type DomainInfo } from '../domain-page.types';

export default function DomainPageMetadataClusters(domainInfo: DomainInfo) {
  const numClusters = domainInfo.clusters.length;
  if (numClusters === 1) {
    return domainInfo.activeClusterName;
  }

  return (
    <div>
      {domainInfo.clusters.map((cluster, index) => {
        const replicationStatusLabel =
          cluster.clusterName === domainInfo.activeClusterName
            ? 'active'
            : 'passive';
        return (
          <React.Fragment key={cluster.clusterName}>
            <LinkBlack
              href={`/domains/${domainInfo.name}/${cluster.clusterName}`}
            >
              {cluster.clusterName}
            </LinkBlack>
            {` (${replicationStatusLabel})`}
            {index < numClusters - 1 ? ', ' : ''}
          </React.Fragment>
        );
      })}
    </div>
  );
}
