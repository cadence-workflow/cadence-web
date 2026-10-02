import buildTaskListPageClusterPath from '../build-task-list-page-cluster-path';

describe(buildTaskListPageClusterPath.name, () => {
  it('builds path for plain values', () => {
    expect(
      buildTaskListPageClusterPath({
        domain: 'my-domain',
        cluster: 'cluster_1',
        taskListName: 'tasklist-1',
      })
    ).toBe('/domains/my-domain/cluster_1/task-lists/tasklist-1');
  });

  it('encodes special characters in domain, cluster and taskListName', () => {
    expect(
      buildTaskListPageClusterPath({
        domain: 'domain%20with',
        cluster: 'cluster_with_special%chars',
        taskListName: 'task@list/1',
      })
    ).toBe(
      '/domains/domain%2520with/cluster_with_special%25chars/task-lists/task%40list%2F1'
    );
  });
});
