import type { TableColumn } from '@/components/table/table.types';
import type { DomainData } from '../domains-page.types';

export type DomainTableColumns = Array<TableColumn<DomainData>>;

export type Props = {
  domains: Array<DomainData>;
  tableColumns?: DomainTableColumns;
};
