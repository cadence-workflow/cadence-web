export default function getDomainsCountLabel({
  count,
  totalCount,
  hasNextPage,
}: {
  count: number;
  totalCount: number;
  hasNextPage: boolean;
}): string {
  const total = hasNextPage ? `${totalCount}+` : `${totalCount}`;
  return count < totalCount ? `${count} of ${total}` : total;
}
