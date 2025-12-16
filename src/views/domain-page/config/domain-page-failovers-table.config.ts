import { createElement } from 'react';

import FormattedDate from '@/components/formatted-date/formatted-date';
import { type TableConfig } from '@/components/table/table.types';
import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import DomainPageFailoverSingleCluster from '../domain-page-failover-single-cluster/domain-page-failover-single-cluster';

const domainPageFailoversTableConfig = [
  {
    name: 'Failover ID',
    id: 'failoverId',
    width: '35%',
    renderCell: (event: FailoverEvent) => event.id,
  },
  {
    name: 'Time',
    id: 'time',
    width: '15%',
    renderCell: (event: FailoverEvent) =>
      createElement(FormattedDate, {
        timestampMs: event.createdTime
          ? parseGrpcTimestamp(event.createdTime)
          : null,
      }),
  },
  {
    name: 'Failover Information',
    id: 'failoverInfo',
    width: '50%',
    renderCell: (event: FailoverEvent) =>
      createElement(DomainPageFailoverSingleCluster, {
        fromCluster: event.clusterFailovers[0]?.fromCluster?.activeClusterName,
        toCluster: event.clusterFailovers[0]?.toCluster?.activeClusterName,
      }),
  },
] as const satisfies TableConfig<FailoverEvent>;

export default domainPageFailoversTableConfig;
