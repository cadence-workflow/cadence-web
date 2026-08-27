export default function getTaskListWorkersBadgeLabel({
  count,
}: {
  variant: 'workers';
  count: number;
}): string {
  return count === 1 ? '1 worker' : `${count} workers`;
}
