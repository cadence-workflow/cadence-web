export type TaskListWorkersBadgeVariant =
  | 'workers'
  | 'decision'
  | 'activity'
  | 'sticky';

export type Props = {
  variant: TaskListWorkersBadgeVariant;
  count?: number;
  isLoading?: boolean;
};
