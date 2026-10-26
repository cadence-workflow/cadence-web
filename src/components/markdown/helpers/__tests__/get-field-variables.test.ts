import getFieldVariables from '../get-field-variables';

describe(getFieldVariables.name, () => {
  it('builds typed variables and skips undefined values', () => {
    expect(
      getFieldVariables(
        { amount: '12.5', note: ' hi ', empty: '', bad: 'x' },
        {
          amount: { type: 'number', required: true },
          note: { type: 'text', required: false },
          empty: { type: 'text', required: false },
          bad: { type: 'number', required: false },
          unset: { type: 'text', required: false },
        }
      )
    ).toEqual({ amount: 12.5, note: ' hi ' });
  });

  it('returns an empty object without field meta', () => {
    expect(getFieldVariables({ a: '1' }, undefined)).toEqual({});
  });

  it('ignores values for fields without meta', () => {
    expect(getFieldVariables({ a: '1' }, {})).toEqual({});
  });
});
