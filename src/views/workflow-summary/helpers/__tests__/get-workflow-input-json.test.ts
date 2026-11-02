import getWorkflowInputJson from '../get-workflow-input-json';

describe(getWorkflowInputJson.name, () => {
  it('returns the input of the start event', () => {
    const input = ['value', { key: 1 }];

    expect(getWorkflowInputJson({ input })).toEqual(input);
  });

  it('returns an empty array when the start event has no input', () => {
    expect(getWorkflowInputJson({})).toEqual([]);
  });

  it('returns an empty array when there is no start event', () => {
    expect(getWorkflowInputJson(undefined)).toEqual([]);
  });
});
