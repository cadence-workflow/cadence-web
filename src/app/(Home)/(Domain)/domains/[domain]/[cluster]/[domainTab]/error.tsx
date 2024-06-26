'use client';
import ErrorPanel from '@/components/error-panel/error-panel';
import { type RequestError } from '@/utils/request/request-error';

export default function DomainTabsError({
  error,
  reset,
}: Readonly<{
  error: RequestError;
  reset: () => void;
}>) {
  return <ErrorPanel message="Failed to load domain content" reset={reset} />;
}
