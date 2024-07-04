import { mockData, mockFormConfig } from '../../__fixtures__/form.fixtures';
import getDefaultValues from '../get-default-values';

describe(getDefaultValues.name, () => {
  it('returns expected values', () => {
    const result = getDefaultValues({
      data: mockData,
      formConfig: mockFormConfig,
    });

    expect(result).toEqual({
      field1: 'mock_data_A',
      field2: 1234,
      field3: true,
    });
  });
});
