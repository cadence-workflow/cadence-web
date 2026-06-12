import { ActiveClusterSelectionStrategy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActiveClusterSelectionStrategy';

import preprocessActiveClusterSelectionPolicy from '../preprocess-active-cluster-selection-policy';

describe('preprocessActiveClusterSelectionPolicy', () => {
  it('returns null when data is null', () => {
    expect(preprocessActiveClusterSelectionPolicy(null)).toBeNull();
  });

  it('returns null when data is undefined', () => {
    expect(preprocessActiveClusterSelectionPolicy(undefined)).toBeNull();
  });

  it('returns null when data is not an object', () => {
    expect(
      preprocessActiveClusterSelectionPolicy('clusterAttribute')
    ).toBeNull();
  });

  it('returns null when clusterAttribute is absent', () => {
    expect(preprocessActiveClusterSelectionPolicy({})).toBeNull();
  });

  it('returns null when clusterAttribute is falsy', () => {
    expect(
      preprocessActiveClusterSelectionPolicy({ clusterAttribute: null })
    ).toBeNull();
  });

  it('returns clusterAttribute with hardcoded INVALID strategy when present', () => {
    const clusterAttribute = { scope: 'region', name: 'us-west' };

    expect(
      preprocessActiveClusterSelectionPolicy({ clusterAttribute })
    ).toEqual({
      clusterAttribute,
      strategy:
        ActiveClusterSelectionStrategy.ACTIVE_CLUSTER_SELECTION_STRATEGY_INVALID,
    });
  });
});
