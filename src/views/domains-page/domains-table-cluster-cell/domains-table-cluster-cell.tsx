'use client';
import React from 'react';

import LinkBlack from '@/components/link-black/link-black';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import type { DomainData } from '@/views/domains-page/domains-page.types';

import { cssStyles } from './domains-table-cluster-cell.styles';

function DomainsTableClusterCell(props: DomainData) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <div className={cls.clustersLinks}>
      {props.clusters.length > 1 &&
        props.clusters.map(({ clusterName }) => (
          <LinkBlack
            key={clusterName}
            href={`/domains/${props.name}/${clusterName}`}
          >
            {clusterName}
          </LinkBlack>
        ))}
      {props.clusters.length === 1 && props.clusters[0]?.clusterName}
    </div>
  );
}

export default DomainsTableClusterCell;
