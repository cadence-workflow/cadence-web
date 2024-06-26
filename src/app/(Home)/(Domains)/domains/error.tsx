'use client';
import ErrorPanel from '@/components/error-panel/error-panel';

export default function DomainsPageError({
  error,
  reset,
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  return <ErrorPanel message="Failed to load domains" reset={reset} />;
}
