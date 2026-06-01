import { type BatchActionListItem } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

export type Props = {
  batchActions: BatchActionListItem[];
  isDraftOpen: boolean;
  isDraftSelected: boolean;
  selectedActionId: string | null;
  onSelectAction: (id: string) => void;
  onSelectDraft: () => void;
  onCreateNew: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
};
