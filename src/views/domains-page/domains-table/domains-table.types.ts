import type { TableConfig } from '@/components/table/table.types';

import type { DomainData } from '../domains-page.types';

export type DomainsTableColumns = TableConfig<DomainData>;

export type Props = {
  /** Already filtered (search text / filters) list of domains; this component only sorts. */
  domains: Array<DomainData>;
  tableColumns?: DomainsTableColumns;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  error: Error | null;
};
