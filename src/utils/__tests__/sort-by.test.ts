import { toggleSortOrder } from '../sort-by';

describe(toggleSortOrder.name, () => {
  it('inverts sort order of current column (ASC -> DESC)', () => {
    expect(
      toggleSortOrder({
        currentSortColumn: 'columnA',
        newSortColumn: 'columnA',
        currentSortOrder: 'ASC',
      })
    ).toEqual('DESC');
  });

  it('inverts sort order of current column (DESC -> ASC)', () => {
    expect(
      toggleSortOrder({
        currentSortColumn: 'columnA',
        newSortColumn: 'columnA',
        currentSortOrder: 'DESC',
      })
    ).toEqual('ASC');
  });

  it('gets ASC sort order for new column by default', () => {
    expect(
      toggleSortOrder({
        currentSortColumn: 'columnA',
        newSortColumn: 'columnB',
        currentSortOrder: 'DESC',
      })
    ).toEqual('ASC');
  });

  it('gets DESC sort order for new column if default is passed', () => {
    expect(
      toggleSortOrder({
        currentSortColumn: 'columnA',
        newSortColumn: 'columnB',
        currentSortOrder: 'DESC',
        defaultSortOrder: 'DESC',
      })
    ).toEqual('DESC');
  });
});
