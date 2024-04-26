import type { TableColumn } from '@/components/table/table.types';
import type { DomainData } from '../domains-page.types';

export type DomainsTableColumns = Array<TableColumn<DomainData>>;

export type Props = {
  domains: Array<DomainData>;
  tableColumns?: DomainsTableColumns;
};
