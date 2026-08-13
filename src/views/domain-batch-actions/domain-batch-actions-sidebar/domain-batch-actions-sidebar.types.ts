import {
  type BatchActionListItem,
  type BatchActionStatus,
} from '@/route-handlers/list-batch-actions/list-batch-actions.types';

export type Props = {
  batchActions: BatchActionListItem[];
  isDraftOpen: boolean;
  isDraftSelected: boolean;
  selectedActionId: string | null;
  // Live status of the selected action from its detail query. When it diverges
  // from the sidebar's copy, the list is refreshed so the sidebar catches up.
  selectedActionDetailStatus: BatchActionStatus | undefined;
  onSelectAction: (action: BatchActionListItem) => void;
  onSelectDraft: () => void;
  onCreateNew: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
};
