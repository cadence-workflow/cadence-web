import { type TableColumn } from '@/components/table/table.types';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

export type Props = {
  domain: string;
  cluster: string;
  hasActiveSearchParams: boolean;
};

export type DomainWorkflowsBasicTableConfig = Array<
  Omit<TableColumn<DomainWorkflow>, 'sortable'>
>;
