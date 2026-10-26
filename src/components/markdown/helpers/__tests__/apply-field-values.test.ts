import applyFieldValues from '../apply-field-values';

describe(applyFieldValues.name, () => {
  it('returns a copy of the input when there are no fields', () => {
    const input = { a: 1 };
    const result = applyFieldValues(input, undefined, {}, {});

    expect(result).toEqual({ input: { a: 1 }, missingRequired: [] });
    expect(result.input).not.toBe(input);
  });

  it('returns undefined input when there is nothing to set', () => {
    expect(
      applyFieldValues(undefined, undefined, {}, {}).input
    ).toBeUndefined();
  });

  it('sets nested paths and converts numbers', () => {
    const input = { items: [{ amount: 0, name: 'x' }] };
    const result = applyFieldValues(
      input,
      { 'items[0].amount': 'amount' },
      { amount: '12.5' },
      { amount: { type: 'number', required: true } }
    );

    expect(result.input).toEqual({ items: [{ amount: 12.5, name: 'x' }] });
    expect(result.missingRequired).toEqual([]);
    expect(input.items[0].amount).toBe(0);
  });

  it('keeps text values as strings', () => {
    const result = applyFieldValues(
      { note: '' },
      { note: 'note' },
      { note: 'hello' },
      { note: { type: 'text', required: false } }
    );

    expect(result.input).toEqual({ note: 'hello' });
  });

  it('keeps spaces around text values', () => {
    const result = applyFieldValues(
      { note: '' },
      { note: 'note' },
      { note: ' hello ' },
      { note: { type: 'text', required: false } }
    );

    expect(result.input).toEqual({ note: ' hello ' });
  });

  it('starts from an empty object when input is undefined', () => {
    const result = applyFieldValues(
      undefined,
      { 'a.b': 'f' },
      { f: 'x' },
      { f: { type: 'text', required: false } }
    );

    expect(result.input).toEqual({ a: { b: 'x' } });
  });

  it('reports an empty required field', () => {
    const result = applyFieldValues(
      { amount: 1 },
      { amount: 'amount' },
      { amount: '  ' },
      { amount: { type: 'number', required: true } }
    );

    expect(result.missingRequired).toEqual(['amount']);
  });

  it('reports a required number that is not a number', () => {
    const result = applyFieldValues(
      { amount: 1 },
      { amount: 'amount' },
      { amount: 'abc' },
      { amount: { type: 'number', required: true } }
    );

    expect(result.missingRequired).toEqual(['amount']);
  });

  it('keeps the template value for an empty optional field', () => {
    const result = applyFieldValues(
      { amount: 1 },
      { amount: 'amount' },
      { amount: '' },
      { amount: { type: 'number', required: false } }
    );

    expect(result).toEqual({ input: { amount: 1 }, missingRequired: [] });
  });

  it('counts a field name with no field definition as missing', () => {
    const result = applyFieldValues(
      { amount: 1 },
      { amount: 'unknown' },
      { unknown: '5' },
      {}
    );

    expect(result).toEqual({
      input: { amount: 1 },
      missingRequired: ['unknown'],
    });
  });

  it('counts an inherited property name as missing instead of throwing', () => {
    const result = applyFieldValues({ a: 1 }, { a: 'toString' }, {}, {});

    expect(result.missingRequired).toEqual(['toString']);
  });
});
