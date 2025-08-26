import React from 'react';

import Link from '@/components/link/link';

import { type DomainDescription } from '../domain-page.types';
import isActiveCluster from '../helpers/is-active-cluster';

import { styled } from './domain-page-metadata-clusters.styles';

export default function DomainPageMetadataClusters(
  domainDescription: DomainDescription
) {
  const numClusters = domainDescription.clusters.length;
  if (numClusters === 1) {
    return domainDescription.activeClusterName;
  }

  return (
    <styled.ClusterTextContainer>
      {domainDescription.clusters.map((cluster, index) => {
        const replicationStatusLabel = isActiveCluster(
          domainDescription,
          cluster.clusterName
        )
          ? 'active'
          : 'passive';

        return (
          <React.Fragment key={cluster.clusterName}>
            <Link
              href={`/domains/${domainDescription.name}/${cluster.clusterName}`}
              style={{ fontWeight: 'inherit' }}
            >
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
