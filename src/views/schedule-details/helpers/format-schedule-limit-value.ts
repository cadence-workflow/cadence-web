export function formatScheduleLimitValue(
  limit: number | null | undefined
): string {
  return limit ? String(limit) : '0 (Unlimited)';
}
