import getArrayValForMultiValParams from '../get-array-val-for-multi-val-params';

describe('getArrayValueForMultiValParams', () => {
  it('should return the passed string value as array with the first element equalt to the same string if isMultiValue', () => {
    const values = getArrayValForMultiValParams('test', true);
    expect(values).toStrictEqual(['test']);
  });

  it('should return the passed array of strings as is if isMultiValue', () => {
    const values = getArrayValForMultiValParams(['test1', 'test2'], true);
    expect(values).toStrictEqual(['test1', 'test2']);
  });

  it('should remove null values from array if isMultiValue', () => {
    const values = getArrayValForMultiValParams(['test1', null, 'test2'], true);
    expect(values).toStrictEqual(['test1', 'test2']);
  });

  it('should return string value as is with the string value if it is not isMultiValue', () => {
    const values = getArrayValForMultiValParams('test', false);
    expect(values).toBe('test');
  });

  it('should return string value as is with the string value if it is not isMultiValue', () => {
    const values = getArrayValForMultiValParams('test', false);
    expect(values).toBe('test');
  });

  it('should return the first string value if the value is mistakenly passed as array of strings while it is not isMultiValue', () => {
    const values = getArrayValForMultiValParams(['test1', 'test2'], false);
    expect(values).toBe('test1');
  });
});
