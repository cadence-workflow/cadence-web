import getWorkflowPayloadValue from '../get-workflow-payload-value';

describe(getWorkflowPayloadValue.name, () => {
  const payload = { order: { items: ['a', 'b'], id: 7 } };

  it('returns the payload when there is no path', () => {
    expect(getWorkflowPayloadValue(payload)).toBe(payload);
  });

  it('returns the value at the path', () => {
    expect(getWorkflowPayloadValue(payload, 'order.items[1]')).toBe('b');
    expect(getWorkflowPayloadValue(payload, 'order.id')).toBe(7);
  });

  it('returns undefined for a missing path', () => {
    expect(getWorkflowPayloadValue(payload, 'order.nope')).toBeUndefined();
  });

  it('returns undefined when the payload is a scalar and a path is given', () => {
    expect(getWorkflowPayloadValue('text', 'a')).toBeUndefined();
    expect(getWorkflowPayloadValue(null, 'a')).toBeUndefined();
  });
});
