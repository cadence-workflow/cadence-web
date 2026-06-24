import { type ReadOnlyDetailsTableRow } from '@/components/read-only-details-table/read-only-details-table.types';

export type Props = {
  title: string;
  rows: ReadOnlyDetailsTableRow[];
  initiallyCollapsed?: boolean;
};
