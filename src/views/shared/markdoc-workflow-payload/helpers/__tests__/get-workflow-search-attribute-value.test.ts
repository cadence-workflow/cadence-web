import getWorkflowSearchAttributeValue from '../get-workflow-search-attribute-value';

describe(getWorkflowSearchAttributeValue.name, () => {
  const attributes = { Status: 'pending', 'a.b': 1 };

  it('returns all attributes when there is no name', () => {
    expect(getWorkflowSearchAttributeValue(attributes)).toBe(attributes);
  });

  it('returns one value by its exact key', () => {
    expect(getWorkflowSearchAttributeValue(attributes, 'Status')).toBe(
      'pending'
    );
    expect(getWorkflowSearchAttributeValue(attributes, 'a.b')).toBe(1);
  });

  it('returns undefined for a missing key', () => {
    expect(getWorkflowSearchAttributeValue(attributes, 'Nope')).toBeUndefined();
    expect(
      getWorkflowSearchAttributeValue(attributes, 'toString')
    ).toBeUndefined();
  });

  it('returns undefined when there are no attributes', () => {
    expect(getWorkflowSearchAttributeValue(undefined)).toBeUndefined();
    expect(
      getWorkflowSearchAttributeValue(undefined, 'Status')
    ).toBeUndefined();
  });
});
