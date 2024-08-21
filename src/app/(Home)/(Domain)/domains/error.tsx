'use client';
import ErrorPanel from '@/components/error-panel/error-panel';

export default function DomainPageError({
  error,
  reset,
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  return (
    <ErrorPanel error={error} message="Failed to load domain" reset={reset} />
  );
}
