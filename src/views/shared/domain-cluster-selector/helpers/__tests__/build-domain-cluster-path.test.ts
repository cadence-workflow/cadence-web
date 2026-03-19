import buildDomainClusterPath from '../build-domain-cluster-path';

describe(buildDomainClusterPath.name, () => {
  it('builds path with domain and cluster only when domainTab is omitted', () => {
    expect(
      buildDomainClusterPath({ domain: 'my-domain', cluster: 'cluster_1' })
    ).toBe('/domains/my-domain/cluster_1');
  });

  it('builds path with domain tab segment when domainTab is provided', () => {
    expect(
      buildDomainClusterPath({
        domain: 'mock-domain',
        cluster: 'cluster_2',
        domainTab: 'workflows',
      })
    ).toBe('/domains/mock-domain/cluster_2/workflows');
  });

  it('encodes special characters in domain and cluster', () => {
    expect(
      buildDomainClusterPath({
        domain: 'domain%20with',
        cluster: 'cluster_with_special%chars',
      })
    ).toBe('/domains/domain%2520with/cluster_with_special%25chars');
  });
});
