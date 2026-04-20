import {
  type BatchAction,
  type SelectedId,
} from '../domain-batch-actions.types';

export type Props = {
  batchActions: BatchAction[];
  hasDraft: boolean;
  selectedId: SelectedId;
  onSelect: (id: number | 'draft') => void;
  onCreateNew: () => void;
};
