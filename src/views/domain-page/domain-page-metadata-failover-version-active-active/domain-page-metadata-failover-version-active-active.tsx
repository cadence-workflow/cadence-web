import { useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import { Table } from 'baseui/table-semantic';
import { MdAdd, MdHorizontalRule } from 'react-icons/md';

import { type ActiveActiveDomain } from '@/views/shared/active-active/active-active.types';

import { MAX_ATTRIBUTES_COUNT_TRUNCATED } from './domain-page-metadata-failover-version-active-active.constants';
import {
  overrides,
  styled,
} from './domain-page-metadata-failover-version-active-active.styles';
import { type FailoverVersionEntryActiveActive } from './domain-page-metadata-failover-version-active-active.types';

export default function DomainPageMetadataFailoverVersionActiveActive(
  domain: ActiveActiveDomain
) {
  const [showAll, setShowAll] = useState(false);

  const allEntries = useMemo<Array<FailoverVersionEntryActiveActive>>(() => {
    return [
      {
        scope: 'default',
        attribute: '-',
        cluster: domain.activeClusterName,
        version: domain.failoverVersion,
      },
      ...Object.entries(
        domain.activeClusters.activeClustersByClusterAttribute
      ).flatMap(([scope, { clusterAttributes }]) =>
        Object.entries(clusterAttributes).map(
          ([attribute, activeClusterInfo]) => ({
            scope,
            attribute,
            cluster: activeClusterInfo.activeClusterName,
            version: activeClusterInfo.failoverVersion,
          })
        )
      ),
    ];
  }, [
    domain.activeClusters.activeClustersByClusterAttribute,
    domain.activeClusterName,
    domain.failoverVersion,
  ]);

  const entriesToShow = useMemo(() => {
    return showAll
      ? allEntries
      : allEntries.slice(0, MAX_ATTRIBUTES_COUNT_TRUNCATED);
  }, [allEntries, showAll]);

  return (
    <styled.FailoverVersionsContainer>
      <Table
        size="compact"
        divider="clean"
        overrides={overrides.table}
        columns={['Scope', 'Attribute', 'Active Cluster', 'Failover Version']}
        data={entriesToShow.map(Object.values)}
      />
      {allEntries.length > MAX_ATTRIBUTES_COUNT_TRUNCATED && (
        <Button
          kind="secondary"
          size="mini"
          shape="pill"
          startEnhancer={showAll ? <MdHorizontalRule /> : <MdAdd />}
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? 'Show less' : `Show all (${allEntries.length})`}
        </Button>
      )}
    </styled.FailoverVersionsContainer>
  );
}
