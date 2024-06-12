import { renderHook, act } from '@/test-utils/rtl';

import { queryParamsConfig } from '../__fixtures__/page-query-params.fixtures';
import usePageQueryParams from '../use-page-query-params';

// Remove this "skip" once the test is fixed
describe.skip('usePageQueryParams', () => {
  it('should return default values when search is empty', () => {
    const { result } = renderHook(() => usePageQueryParams(queryParamsConfig));
    const [values] = result.current;
    expect(values).toStrictEqual({
      sortBy: undefined,
      aliased: undefined,
      defaulted: 'defaultValue',
      parsed: undefined,
      parsedMultiVal: undefined,
      multiValDefaulted: ['a'],
    });
  });
  it('should update values by calling the single key setter method', async () => {
    const { result } = renderHook(() => usePageQueryParams(queryParamsConfig));
    const [, setValues] = result.current;

    act(() => {
      setValues({ sortBy: 'a' });
    });

    const [values] = result.current;
    expect(values).toStrictEqual({
      sortBy: 'a',
      aliased: undefined,
      defaulted: 'defaultValue',
      parsed: undefined,
      parsedMultiVal: undefined,
      multiValDefaulted: ['a'],
    });
  });

  it('should update values by calling the multiple keys setter method', async () => {
    const { result } = renderHook(() => usePageQueryParams(queryParamsConfig));
    const [, setValues] = result.current;

    act(() => {
      setValues({
        sortBy: 'a',
        defaulted: 'nonDefaultValue',
        aliased: 'b',
        parsed: '2',
        parsedMultiVal: ['1', '2'],
        multiValDefaulted: ['a', 'a'],
      });
    });

    const [values] = result.current;
    expect(values).toStrictEqual({
      sortBy: 'a',
      aliased: 'b',
      defaulted: 'nonDefaultValue',
      parsed: 2,
      parsedMultiVal: [1, 2],
      multiValDefaulted: ['a', 'a'],
    });
  });
});
