import { type BatchAction } from '../domain-batch-actions.types';

export type Props = {
  batchActions: BatchAction[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};
