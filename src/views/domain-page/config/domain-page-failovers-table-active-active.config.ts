import { createElement } from 'react';

import { type TableConfig } from '@/components/table/table.types';

import DomainPageFailoverActiveActive from '../domain-page-failover-active-active/domain-page-failover-active-active';
import { type FailoverEventActiveActive } from '../domain-page-failovers/domain-page-failovers.types';

import domainPageFailoversTableConfig from './domain-page-failovers-table.config';

const domainPageFailoversTableActiveActiveConfig = [
  ...domainPageFailoversTableConfig.slice(0, 2),
  {
    ...domainPageFailoversTableConfig[2],
    renderCell: (event: FailoverEventActiveActive) =>
      createElement(DomainPageFailoverActiveActive, { failoverEvent: event }),
  },
] as const satisfies TableConfig<FailoverEventActiveActive>;

export default domainPageFailoversTableActiveActiveConfig;
