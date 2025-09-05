import { processWorkflowInput } from '../process-workflow-input';

describe('processWorkflowInput', () => {
  it('should return undefined when input is undefined', () => {
    const result1 = processWorkflowInput({
      input: undefined,
      workerSDKLanguage: 'GO',
    });
    expect(result1).toBeUndefined();
    const result2 = processWorkflowInput({
      input: undefined,
      workerSDKLanguage: 'JAVA',
    });
    expect(result2).toBeUndefined();
  });

  it('should return undefined when input is empty array', () => {
    const result1 = processWorkflowInput({
      input: [],
      workerSDKLanguage: 'GO',
    });
    expect(result1).toBeUndefined();

    const result2 = processWorkflowInput({
      input: [],
      workerSDKLanguage: 'JAVA',
    });
    expect(result2).toBeUndefined();
  });

  it('should join arguments with spaces for GO language', () => {
    const input = ['arg1', 42, true, null];
    const result = processWorkflowInput({
      input,
      workerSDKLanguage: 'GO',
    });
    expect(result).toBe('"arg1" 42 true null');
  });

  it('should join arguments with spaces when workerSDKLanguage is undefined', () => {
    const input = ['arg1', 42, true, null];
    const result = processWorkflowInput({
      input,
      // @ts-expect-error Testing with wrong attribute `undefined`
      workerSDKLanguage: undefined,
    });
    expect(result).toBe('"arg1" 42 true null');
  });

  it('should return JSON array for JAVA language when multiple arguments', () => {
    const input = ['arg1', 42, true];
    const result = processWorkflowInput({
      input,
      workerSDKLanguage: 'JAVA',
    });
    expect(result).toBe('["arg1",42,true]');
  });

  it('should return JSON array for JAVA language when first argument is an array', () => {
    const input = [['nested', 'array']];
    const result = processWorkflowInput({
      input,
      workerSDKLanguage: 'JAVA',
    });
    expect(result).toBe('[["nested","array"]]');
  });

  it('should return single JSON value for JAVA language when single non-array argument', () => {
    const result1 = processWorkflowInput({
      input: [{ key: 'value', number: 42 }],
      workerSDKLanguage: 'JAVA',
    });
    expect(result1).toBe('{"key":"value","number":42}');

    const result2 = processWorkflowInput({
      input: ['single-value'],
      workerSDKLanguage: 'JAVA',
    });
    expect(result2).toBe('"single-value"');
    const result3 = processWorkflowInput({
      input: [true],
      workerSDKLanguage: 'JAVA',
    });
    expect(result3).toBe('true');

    const result4 = processWorkflowInput({
      input: [null],
      workerSDKLanguage: 'JAVA',
    });
    expect(result4).toBe('null');

    const result5 = processWorkflowInput({
      input: [42],
      workerSDKLanguage: 'JAVA',
    });
    expect(result5).toBe('42');
  });

  it('should handle empty string in input', () => {
    const input = [''];
    const expectedResult = '""';
    const result1 = processWorkflowInput({
      input,
      workerSDKLanguage: 'GO',
    });
    expect(result1).toBe(expectedResult);
    const result2 = processWorkflowInput({
      input,
      workerSDKLanguage: 'JAVA',
    });
    expect(result2).toBe(expectedResult);
  });

  it('should handle special characters in strings', () => {
    const specialCharacters = ['special\ncharacters\t"quotes"'];
    const expectedResult = '"special\\ncharacters\\t\\"quotes\\""';
    const result1 = processWorkflowInput({
      input: specialCharacters,
      workerSDKLanguage: 'GO',
    });
    expect(result1).toBe(expectedResult);

    const result2 = processWorkflowInput({
      input: specialCharacters,
      workerSDKLanguage: 'JAVA',
    });
    expect(result2).toBe(expectedResult);
  });
});
