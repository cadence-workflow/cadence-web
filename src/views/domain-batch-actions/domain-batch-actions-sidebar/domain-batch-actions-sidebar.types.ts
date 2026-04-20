import {
  type BatchAction,
  type SelectedId,
} from '../domain-batch-actions.types';

export type Props = {
  batchActions: BatchAction[];
  isDraftOpen: boolean;
  isDraftSelected: boolean;
  selectedActionId: string | null;
  onSelectAction: (id: string) => void;
  onSelectDraft: () => void;
  onCreateNew: () => void;
};
