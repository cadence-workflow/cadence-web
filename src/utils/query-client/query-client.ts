import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: Infinity,
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Browser: the one shared client — the ReactQueryProvider and the
 * post-recovery invalidation fan-out must see the same cache. Server: always
 * a fresh client per render.
 */
export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
