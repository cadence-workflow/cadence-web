import { type InfiniteQueryObserverResult } from '@tanstack/react-query';

import { type MergedQueryStatus } from '../use-merged-infinite-queries.types';

export default function getMergedQueryStatus(
  queryResults: Array<InfiniteQueryObserverResult>
): MergedQueryStatus {
  let didAnyQuerySucceed = false;
  for (let index = 0; index < queryResults.length; index++) {
    const qr = queryResults[index];
    if (qr.status === 'error') {
      return 'error';
    }
    if (qr.fetchStatus === 'fetching') {
      return 'loading';
    }
    if (qr.status === 'success') {
      didAnyQuerySucceed = true;
    }
  }
  return didAnyQuerySucceed ? 'success' : 'idle';
}
