import buildSortParams from '../build-sort-params';

describe(buildSortParams.name, () => {
  it('returns sort params with the provided sortColumn and sortOrder', () => {
    const result = buildSortParams({
      sortColumn: 'StartTime',
      sortOrder: 'DESC',
      setSortQueryParams: jest.fn(),
    });

    expect(result).toEqual({
      onSort: expect.any(Function),
      sortColumn: 'StartTime',
      sortOrder: 'DESC',
    });
  });

  it('calls setSortQueryParams with toggled sort order when sorting the same column', () => {
    const setSortQueryParams = jest.fn();

    const result = buildSortParams({
      sortColumn: 'StartTime',
      sortOrder: 'DESC',
      setSortQueryParams,
    });

    result.onSort('StartTime');

    expect(setSortQueryParams).toHaveBeenCalledWith({
      sortColumn: 'StartTime',
      sortOrder: 'ASC',
    });
  });

  it('calls setSortQueryParams with default DESC order when sorting a different column', () => {
    const setSortQueryParams = jest.fn();

    const result = buildSortParams({
      sortColumn: 'StartTime',
      sortOrder: 'DESC',
      setSortQueryParams,
    });

    result.onSort('CloseTime');

    expect(setSortQueryParams).toHaveBeenCalledWith({
      sortColumn: 'CloseTime',
      sortOrder: 'DESC',
    });
  });
});
