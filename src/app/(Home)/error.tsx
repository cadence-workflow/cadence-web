'use client';
import ErrorPanel from '@/components/error-panel/error-panel';

export default function HomePageError({
  error,
  reset,
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  return (
    <ErrorPanel error={error} message="Something went wrong" reset={reset} />
  );
}
