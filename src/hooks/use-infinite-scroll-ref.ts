import { useEffect } from 'react';

import { useInView } from 'react-intersection-observer';

/**
 * A React hook enabling infinite scroll via IntersectionObserver. Triggers `fetchResults` when the div
 * attached to the returned ref becomes visible, if `isFetchingResults` is false.
 */
export default function useInfiniteScrollRef({
  fetchResults,
  isFetchingResults,
}: {
  fetchResults: () => void;
  isFetchingResults: boolean;
}) {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && !isFetchingResults) {
      fetchResults();
    }
  }, [inView, fetchResults, isFetchingResults]);

  return ref;
}
