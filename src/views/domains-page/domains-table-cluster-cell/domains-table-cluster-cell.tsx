'use client';
import React from 'react';

import type { DomainData } from '@/views/domains-page/domains-page.types';
import TableLink from '@/views/domains-page/domains-table-link/domains-table-link';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import { cssStyles } from './domains-table-cluster-cell.styles';

function DomainsTableClusterCell(props: DomainData) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <div className={cls.clustersLinks}>
      {props.clusters.length > 1 &&
        props.clusters.map(({ clusterName }) => (
          <TableLink key={clusterName} href={'/'}>
            {clusterName}
          </TableLink>
        ))}
      {props.clusters.length === 1 && props.clusters[0]?.clusterName}
    </div>
  );
}

export default DomainsTableClusterCell;
