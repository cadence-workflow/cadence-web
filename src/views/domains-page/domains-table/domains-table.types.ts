import type { TableConfig } from '@/components/table/table.types';

import type { DomainData } from '../domains-page.types';

export type DomainsTableColumns = TableConfig<DomainData>;

export type Props = {
  domains: Array<DomainData>;
  tableColumns?: DomainsTableColumns;
};
