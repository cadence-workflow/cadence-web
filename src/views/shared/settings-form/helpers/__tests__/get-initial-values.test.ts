import {
  mockData,
  mockFormConfig,
} from '../../__fixtures__/settings-form.fixtures';
import getInitialValues from '../get-initial-values';

describe(getInitialValues.name, () => {
  it('returns expected values', () => {
    const result = getInitialValues({
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
