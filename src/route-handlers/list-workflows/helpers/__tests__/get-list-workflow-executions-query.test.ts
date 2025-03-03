import getListWorkflowExecutionsQuery from '../get-list-workflow-executions-query';

describe('getListWorkflowExecutionsQuery', () => {
  it('should return query to show various open and closed workflows', () => {
    const query = getListWorkflowExecutionsQuery({
      search: 'mocksearchterm',
      workflowStatuses: [
        'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
        'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED',
        'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
      ],
      sortColumn: 'CloseTime',
      sortOrder: 'ASC',
      timeColumn: 'StartTime',
      timeRangeStart: '1712066100000000',
      timeRangeEnd: '1712096100000000',
    });
    expect(query).toEqual(
      '(WorkflowType = "mocksearchterm" OR WorkflowID = "mocksearchterm" OR RunID = "mocksearchterm") AND ' +
        '(CloseStatus = 3 OR CloseStatus = 2 OR CloseTime = missing) AND ' +
        'StartTime > "1712066100000000" AND StartTime <= "1712096100000000" ORDER BY CloseTime ASC'
    );
  });

  it('should return default query with no params except for time column', () => {
    const query = getListWorkflowExecutionsQuery({ timeColumn: 'StartTime' });
    expect(query).toEqual('ORDER BY StartTime DESC');
  });
});
