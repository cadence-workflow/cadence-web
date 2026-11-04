import getMissingFields from '../get-missing-fields';

describe(getMissingFields.name, () => {
  it('reports an empty required field', () => {
    expect(
      getMissingFields(
        ['amount'],
        { amount: '  ' },
        { amount: { type: 'number', required: true } }
      )
    ).toEqual(['amount']);
  });

  it('reports a required number that is not a number', () => {
    expect(
      getMissingFields(
        ['amount'],
        { amount: 'abc' },
        { amount: { type: 'number', required: true } }
      )
    ).toEqual(['amount']);
  });

  it('reports a required field with no value', () => {
    expect(
      getMissingFields(['amount'], undefined, {
        amount: { type: 'text', required: true },
      })
    ).toEqual(['amount']);
  });

  it('does not report an empty optional field', () => {
    expect(
      getMissingFields(
        ['amount'],
        { amount: '' },
        { amount: { type: 'number', required: false } }
      )
    ).toEqual([]);
  });

  it('does not report a filled required field', () => {
    expect(
      getMissingFields(
        ['amount'],
        { amount: '5' },
        { amount: { type: 'number', required: true } }
      )
    ).toEqual([]);
  });

  it('reports a name with no field definition', () => {
    expect(getMissingFields(['unknown'], { unknown: '5' }, {})).toEqual([
      'unknown',
    ]);
    expect(getMissingFields(['unknown'], {}, undefined)).toEqual(['unknown']);
  });

  it('reports an inherited property name instead of throwing', () => {
    expect(getMissingFields(['toString'], {}, {})).toEqual(['toString']);
  });
});
