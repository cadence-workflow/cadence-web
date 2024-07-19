import * as nextRouterMock from 'next-router-mock';

import { renderHook, act } from '@/test-utils/rtl';

import { queryParamsConfig } from '../__fixtures__/page-query-params.fixtures';
import usePageQueryParams from '../use-page-query-params';

jest.mock('next/router', () => nextRouterMock);

//TODO: @assem.hafez refactor all next/navigations to use the same mock
jest.mock('next/navigation', () => {
  const { useRouter } = nextRouterMock;
  const usePathname = () => {
    const router = useRouter();
    return router.pathname;
  };

  const useSearchParams = () => {
    const router = useRouter();
    return new URLSearchParams(router.asPath); // use asPath to get the url as set by our implementation, using router.query or router.search return multivalues in a different format than the actual url
  };

  return {
    useRouter,
    usePathname,
    useSearchParams,
  };
});

describe('usePageQueryParams', () => {
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
