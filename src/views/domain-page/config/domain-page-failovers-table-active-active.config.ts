import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';

import domainPageFailoversTableConfig from './domain-page-failovers-table.config';

const domainPageFailoversTableActiveActiveConfig = [
  ...domainPageFailoversTableConfig.slice(0, 3),
  {
    name: 'Failover Information AA',
    id: 'failoverInfo',
    width: '40%',
    renderCell: (event: FailoverEvent) =>
      JSON.stringify(event.clusterFailovers),
  },
];

export default domainPageFailoversTableActiveActiveConfig;
