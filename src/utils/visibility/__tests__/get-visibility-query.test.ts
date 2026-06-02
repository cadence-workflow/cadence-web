import getVisibilityQuery from '../get-visibility-query';

describe('getVisibilityQuery', () => {
  it('should return query to show various open and closed workflows', () => {
    const query = getVisibilityQuery({
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
    const query = getVisibilityQuery({ timeColumn: 'StartTime' });
    expect(query).toEqual('ORDER BY StartTime DESC');
  });

  it('should omit ORDER BY when includeOrderBy is false', () => {
    const query = getVisibilityQuery({
      search: 'mocksearchterm',
      timeColumn: 'StartTime',
      includeOrderBy: false,
    });
    expect(query).toEqual(
      '(WorkflowType = "mocksearchterm" OR WorkflowID = "mocksearchterm" OR RunID = "mocksearchterm")'
    );
  });

  it('should return empty string when includeOrderBy is false and no filters', () => {
    const query = getVisibilityQuery({
      timeColumn: 'StartTime',
      includeOrderBy: false,
    });
    expect(query).toEqual('');
  });

  it('should use LIKE comparator when partial matching is enabled', () => {
    const query = getVisibilityQuery({
      search: 'mocksearchterm',
      timeColumn: 'StartTime',
      includeOrderBy: false,
      isPartialMatchingEnabled: true,
    });
    expect(query).toEqual(
      '(WorkflowType LIKE "mocksearchterm" OR WorkflowID LIKE "mocksearchterm" OR RunID LIKE "mocksearchterm")'
    );
  });
});
