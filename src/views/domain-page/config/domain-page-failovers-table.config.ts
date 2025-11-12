import { createElement } from 'react';

import FormattedDate from '@/components/formatted-date/formatted-date';
import { type TableConfig } from '@/components/table/table.types';
import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

const domainPageFailoversTableConfig = [
  {
    name: 'Failover ID',
    id: 'failoverId',
    width: '25%',
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
    name: 'Type',
    id: 'type',
    width: '10%',
    renderCell: (event: FailoverEvent) => event.failoverType,
  },
  {
    name: 'Failover Information',
    id: 'failoverInfo',
    width: '50%',
    renderCell: (event: FailoverEvent) =>
      JSON.stringify(event.clusterFailovers),
  },
] as const satisfies TableConfig<FailoverEvent>;

export default domainPageFailoversTableConfig;
