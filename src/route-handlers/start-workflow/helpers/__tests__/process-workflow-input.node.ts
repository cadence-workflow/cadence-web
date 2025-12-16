import processWorkflowInput from '../process-workflow-input';

describe('processWorkflowInput', () => {
  it('should return undefined when input is undefined', () => {
    expect(
      processWorkflowInput({
        input: undefined,
        workerSDKLanguage: 'GO',
      })
    ).toBeUndefined();
    expect(
      processWorkflowInput({
        input: undefined,
        workerSDKLanguage: 'JAVA',
      })
    ).toBeUndefined();
  });

  it('should return undefined when input is empty array', () => {
    expect(
      processWorkflowInput({
        input: [],
        workerSDKLanguage: 'GO',
      })
    ).toBeUndefined();

    expect(
      processWorkflowInput({
        input: [],
        workerSDKLanguage: 'JAVA',
      })
    ).toBeUndefined();
  });

  it('should join arguments with spaces for GO language', () => {
    const input = ['arg1', 42, true, null];
    expect(
      processWorkflowInput({
        input,
        workerSDKLanguage: 'GO',
      })
    ).toBe('"arg1" 42 true null');
  });

  it('should join arguments with spaces when workerSDKLanguage is undefined', () => {
    const input = ['arg1', 42, true, null];
    expect(
      processWorkflowInput({
        input,
        // @ts-expect-error Testing with wrong attribute `undefined`
        workerSDKLanguage: undefined,
      })
    ).toBe('"arg1" 42 true null');
  });

  it('should return JSON array for JAVA language when multiple arguments', () => {
    const input = ['arg1', 42, true];
    expect(
      processWorkflowInput({
        input,
        workerSDKLanguage: 'JAVA',
      })
    ).toBe('["arg1",42,true]');
  });

  it('should return JSON array for JAVA language when first argument is an array', () => {
    const input = [['nested', 'array']];
    expect(
      processWorkflowInput({
        input,
        workerSDKLanguage: 'JAVA',
      })
    ).toBe('[["nested","array"]]');
  });

  it('should return single JSON value for JAVA language when single non-array argument', () => {
    expect(
      processWorkflowInput({
        input: [{ key: 'value', number: 42 }],
        workerSDKLanguage: 'JAVA',
      })
    ).toBe('{"key":"value","number":42}');

    expect(
      processWorkflowInput({
        input: ['single-value'],
        workerSDKLanguage: 'JAVA',
      })
    ).toBe('"single-value"');
    expect(
      processWorkflowInput({
        input: [true],
        workerSDKLanguage: 'JAVA',
      })
    ).toBe('true');

    expect(
      processWorkflowInput({
        input: [null],
        workerSDKLanguage: 'JAVA',
      })
    ).toBe('null');

    expect(
      processWorkflowInput({
        input: [42],
        workerSDKLanguage: 'JAVA',
      })
    ).toBe('42');
  });

  it('should handle empty string in input', () => {
    const input = [''];
    const expectedResult = '""';
    expect(
      processWorkflowInput({
        input,
        workerSDKLanguage: 'GO',
      })
    ).toBe(expectedResult);
    expect(
      processWorkflowInput({
        input,
        workerSDKLanguage: 'JAVA',
      })
    ).toBe(expectedResult);
  });

  it('should handle special characters in strings', () => {
    const specialCharacters = ['special\ncharacters\t"quotes"'];
    const expectedResult = '"special\\ncharacters\\t\\"quotes\\""';
    expect(
      processWorkflowInput({
        input: specialCharacters,
        workerSDKLanguage: 'GO',
      })
    ).toBe(expectedResult);

    expect(
      processWorkflowInput({
        input: specialCharacters,
        workerSDKLanguage: 'JAVA',
      })
    ).toBe(expectedResult);
  });
});
