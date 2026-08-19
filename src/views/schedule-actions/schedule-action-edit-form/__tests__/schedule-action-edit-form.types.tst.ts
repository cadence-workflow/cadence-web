import { describe, expect, it } from 'tstyche';

import type { ExhaustiveDefaults } from '../schedule-action-edit-form.types.js';

type Fields = {
  required: string;
  optional?: number;
};

describe('ExhaustiveDefaults', () => {
  it('accepts a literal that assigns every field', () => {
    expect<ExhaustiveDefaults<Fields>>().type.toBeAssignableWith({
      required: 'value',
      optional: 1,
    });
  });

  it('still allows an optional field to be assigned undefined', () => {
    expect<ExhaustiveDefaults<Fields>>().type.toBeAssignableWith({
      required: 'value',
      optional: undefined,
    });
  });

  it('rejects a literal that leaves an optional field out', () => {
    expect<ExhaustiveDefaults<Fields>>().type.not.toBeAssignableWith({
      required: 'value',
    });
  });
});
