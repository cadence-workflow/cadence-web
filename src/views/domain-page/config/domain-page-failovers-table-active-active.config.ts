import { createElement } from 'react';

import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';

import DomainPageFailoverActiveActive from '../domain-page-failover-active-active/domain-page-failover-active-active';

import domainPageFailoversTableConfig from './domain-page-failovers-table.config';

const domainPageFailoversTableActiveActiveConfig = [
  ...domainPageFailoversTableConfig.slice(0, 3),
  {
    ...domainPageFailoversTableConfig[3],
    renderCell: (event: FailoverEvent) =>
      createElement(DomainPageFailoverActiveActive, { failoverEvent: event }),
  },
];

export default domainPageFailoversTableActiveActiveConfig;
