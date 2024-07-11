import React from 'react';

import Link from '@/components/link/link';

import { type DomainInfo } from '../domain-page.types';

import { styled } from './domain-page-metadata-clusters.styles';

export default function DomainPageMetadataClusters(domainInfo: DomainInfo) {
  const numClusters = domainInfo.clusters.length;
  if (numClusters === 1) {
    return domainInfo.activeClusterName;
  }

  return (
    <styled.ClusterTextContainer>
      {domainInfo.clusters.map((cluster, index) => {
        const replicationStatusLabel =
          cluster.clusterName === domainInfo.activeClusterName
            ? 'active'
            : 'passive';
        return (
          <React.Fragment key={cluster.clusterName}>
            <Link href={`/domains/${domainInfo.name}/${cluster.clusterName}`}>
              {cluster.clusterName}
            </Link>
            {` (${replicationStatusLabel})`}
            {index < numClusters - 1 ? ', ' : ''}
          </React.Fragment>
        );
      })}
    </styled.ClusterTextContainer>
  );
}
