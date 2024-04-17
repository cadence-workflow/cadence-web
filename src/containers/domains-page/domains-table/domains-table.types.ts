import type { TableColumn } from '@/layout/table/table.types';
import type { DomainData } from '../domains-page.types';

export type DomainTableColumns = Array<TableColumn<DomainData>>;

export type Props = {
  domains: Array<DomainData>;
  tableColumns?: DomainTableColumns;
};
