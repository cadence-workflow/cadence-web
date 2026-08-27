export type TaskListWorkersBadgeVariant = 'workers' | 'sticky';

export type Props = {
  variant: TaskListWorkersBadgeVariant;
  count?: number;
  isLoading?: boolean;
};
