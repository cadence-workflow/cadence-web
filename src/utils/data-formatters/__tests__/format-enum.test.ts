import formatEnum from '../format-enum';

describe('formatEnum', () => {
  it('should return null when enum contains INVALID', () => {
    const input = ['CONTAINS_INVALID'] as const;
    const output = formatEnum(input[0]);

    expect(output).toEqual(null);
  });

  it('should format enum by removing prefix and converts to snake case (by default)', () => {
    const input = ['PREFIX_ENUM_SNAKE_VALUE', 'PREFIX_ENUM'] as const;
    const output = formatEnum(...input);

    expect(output).toEqual('snake_value');
  });

  it('should format enum by removing prefix and convert to pascal case when caseFormat is pascal.', () => {
    const input = [
      'PREFIX_ENUM_PASCAL_VALUE',
      'PREFIX_ENUM',
      'pascal',
    ] as const;
    const output = formatEnum(...input);

    expect(output).toEqual('pascal value');
  });
});
