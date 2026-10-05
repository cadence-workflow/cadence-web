import escapeVisibilityQueryValue from '../escape-visibility-query-value';

describe(escapeVisibilityQueryValue.name, () => {
  it('returns a quote-free value unchanged', () => {
    expect(escapeVisibilityQueryValue('my-workflow-id')).toBe('my-workflow-id');
  });

  it('escapes double quotes', () => {
    expect(escapeVisibilityQueryValue('wf"id')).toBe('wf\\"id');
  });

  it('escapes single quotes', () => {
    expect(escapeVisibilityQueryValue("wf'id")).toBe("wf\\'id");
  });

  it('escapes backslashes', () => {
    expect(escapeVisibilityQueryValue('wf\\id')).toBe('wf\\\\id');
  });

  it('escapes the backslash before the quote so escapes are not doubled', () => {
    expect(escapeVisibilityQueryValue('wf\\')).toBe('wf\\\\');
    expect(escapeVisibilityQueryValue('a\\"b')).toBe('a\\\\\\"b');
  });

  it('escapes every occurrence', () => {
    expect(escapeVisibilityQueryValue('a"b"c')).toBe('a\\"b\\"c');
  });

  it('returns an empty string unchanged', () => {
    expect(escapeVisibilityQueryValue('')).toBe('');
  });
});
