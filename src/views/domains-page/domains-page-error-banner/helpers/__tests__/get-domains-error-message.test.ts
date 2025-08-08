import { type DomainsListingFailedCluster } from '../../domains-page-error-banner.types';
import { getDomainsErrorMessage } from '../get-domains-error-message';

describe('getDomainsErrorMessage', () => {
  it('should return empty string when failedClusters is empty', () => {
    const result = getDomainsErrorMessage({ failedClusters: [] });
    expect(result).toBe('');
  });

  it('should return empty string when failedClusters is null', () => {
    const result = getDomainsErrorMessage({ failedClusters: null as any });
    expect(result).toBe('');
  });

  it('should return empty string when failedClusters is undefined', () => {
    const result = getDomainsErrorMessage({ failedClusters: undefined as any });
    expect(result).toBe('');
  });

  it('should return service unavailable message when all clusters have 503 status', () => {
    const failedClusters: DomainsListingFailedCluster[] = [
      { clusterName: 'cluster-1', httpStatus: 503 },
      { clusterName: 'cluster-2', httpStatus: 503 },
      { clusterName: 'cluster-3', httpStatus: 503 },
    ];

    const result = getDomainsErrorMessage({ failedClusters });

    expect(result).toBe(
      'Failed to connect to the following clusters: cluster-1, cluster-2, cluster-3'
    );
  });

  it('should return API failure message when all clusters have non-503 status', () => {
    const failedClusters: DomainsListingFailedCluster[] = [
      { clusterName: 'cluster-1', httpStatus: 500 },
      { clusterName: 'cluster-2', httpStatus: 404 },
      { clusterName: 'cluster-3', httpStatus: 403 },
    ];

    const result = getDomainsErrorMessage({ failedClusters });

    expect(result).toBe(
      'Failed to fetch domains for following clusters: cluster-1, cluster-2, cluster-3'
    );
  });

  it('should return detailed message with status codes when clusters have mixed status codes', () => {
    const failedClusters: DomainsListingFailedCluster[] = [
      { clusterName: 'cluster-1', httpStatus: 503 },
      { clusterName: 'cluster-2', httpStatus: 500 },
      { clusterName: 'cluster-3', httpStatus: 404 },
    ];

    const result = getDomainsErrorMessage({ failedClusters });

    expect(result).toBe(
      'Failed to fetch domains for following clusters: cluster-1 (503), cluster-2 (500), cluster-3 (404)'
    );
  });

  it('should handle single cluster with 503 status', () => {
    const failedClusters: DomainsListingFailedCluster[] = [
      { clusterName: 'single-cluster', httpStatus: 503 },
    ];

    const result = getDomainsErrorMessage({ failedClusters });

    expect(result).toBe(
      'Failed to connect to the following clusters: single-cluster'
    );
  });

  it('should handle single cluster with non-503 status', () => {
    const failedClusters: DomainsListingFailedCluster[] = [
      { clusterName: 'single-cluster', httpStatus: 500 },
    ];

    const result = getDomainsErrorMessage({ failedClusters });

    expect(result).toBe(
      'Failed to fetch domains for following clusters: single-cluster'
    );
  });
});
