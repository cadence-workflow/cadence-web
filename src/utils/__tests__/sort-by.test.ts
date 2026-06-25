import sortBy, { getSortCompareFunction, toggleSortOrder } from '../sort-by';

describe(getSortCompareFunction.name, () => {
  it('sorts strings using locale-aware comparison in ASC order', () => {
    const compare = getSortCompareFunction<{ v: string }>((item) => item.v, 'ASC');
    const items = [{ v: 'b' }, { v: 'a' }];

    expect([...items].sort(compare)).toEqual([{ v: 'a' }, { v: 'b' }]);
  });

  it('sorts numbers in ASC order', () => {
    const compare = getSortCompareFunction<{ v: number }>((item) => item.v, 'ASC');
    const items = [{ v: 3 }, { v: 1 }, { v: 2 }];

    expect([...items].sort(compare)).toEqual([{ v: 1 }, { v: 2 }, { v: 3 }]);
  });

  it('inverts non-equal comparisons for DESC order', () => {
    const compare = getSortCompareFunction<{ v: number }>((item) => item.v, 'DESC');
    const items = [{ v: 1 }, { v: 3 }, { v: 2 }];

    expect([...items].sort(compare)).toEqual([{ v: 3 }, { v: 2 }, { v: 1 }]);
  });

  it('returns zero when sort values are equal', () => {
    const compare = getSortCompareFunction<{ v: number }>((item) => item.v, 'DESC');

    expect(compare({ v: 1 }, { v: 1 })).toBe(0);
  });

  it('places undefined and null before other values with undefined first', () => {
    const compare = getSortCompareFunction<{ v: number | null | undefined }>(
      (item) => item.v,
      'ASC'
    );
    const items = [{ v: 2 }, { v: null }, { v: undefined }, { v: 1 }];

    expect([...items].sort(compare)).toEqual([
      { v: undefined },
      { v: null },
      { v: 1 },
      { v: 2 },
    ]);
  });
});

describe(sortBy.name, () => {
  it('sorts a copy of the input array', () => {
    const items = [{ v: 2 }, { v: 1 }];

    expect(sortBy(items, (item) => item.v, 'ASC')).toEqual([{ v: 1 }, { v: 2 }]);
    expect(items).toEqual([{ v: 2 }, { v: 1 }]);
  });
});

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
