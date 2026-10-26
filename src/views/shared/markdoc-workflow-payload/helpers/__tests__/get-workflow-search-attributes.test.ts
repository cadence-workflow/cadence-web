import getWorkflowSearchAttributes from '../get-workflow-search-attributes';

const encode = (value: string) => ({
  data: Buffer.from(value).toString('base64'),
});

describe(getWorkflowSearchAttributes.name, () => {
  it('decodes every attribute', () => {
    expect(
      getWorkflowSearchAttributes({
        CustomKeywordField: encode('"pending"'),
        CustomDoubleField: encode('12.5'),
      })
    ).toEqual({ CustomKeywordField: 'pending', CustomDoubleField: 12.5 });
  });

  it('returns undefined when there are no attributes', () => {
    expect(getWorkflowSearchAttributes({})).toBeUndefined();
    expect(getWorkflowSearchAttributes(null)).toBeUndefined();
    expect(getWorkflowSearchAttributes(undefined)).toBeUndefined();
  });

  it('returns null for an empty payload', () => {
    expect(getWorkflowSearchAttributes({ Empty: {} })).toEqual({
      Empty: null,
    });
  });
});
