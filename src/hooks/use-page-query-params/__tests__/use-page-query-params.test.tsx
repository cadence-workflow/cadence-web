import { renderHook, act } from '@/test-utils/rtl';

import { queryParamsConfig } from '../__fixtures__/page-query-params.fixtures';
import usePageQueryParams from '../use-page-query-params';

let mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

describe('usePageQueryParams', () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    window.history.replaceState(null, '', '/');
    jest.restoreAllMocks();
  });

  it('should return default values when search is empty', () => {
    const { result } = setup();
    expect(result.current[0]).toStrictEqual({
      sortBy: undefined,
      aliased: undefined,
      defaulted: 'defaultValue',
      parsed: undefined,
      parsedMultiVal: undefined,
      multiValDefaulted: ['a'],
    });
  });

  it('should read values from the url', () => {
    window.history.replaceState(null, '', '/?sortBy=sortByValue1&parsed=2');
    mockSearchParams = new URLSearchParams('sortBy=sortByValue1&parsed=2');
    const { result } = setup();
    expect(result.current[0]).toMatchObject({
      sortBy: 'sortByValue1',
      parsed: 2,
    });
  });

  it('should follow the url on popstate even when Next search params are stale', () => {
    const { result } = setup();

    act(() => {
      window.history.replaceState(null, '', '/?sortBy=fromBack');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current[0].sortBy).toBe('fromBack');
  });

  it('should refresh sibling hook instances after a write', () => {
    const { result: a } = setup();
    const { result: b } = setup();

    act(() => a.current[1]({ sortBy: 'shared' }));

    expect(b.current[0].sortBy).toBe('shared');
  });

  it('should write the url through History with null state', () => {
    const pushState = jest.spyOn(window.history, 'pushState');
    const { result } = setup();

    act(() => result.current[1]({ sortBy: 'a', parsed: '2' }));

    expect(pushState).toHaveBeenCalledWith(null, '', '/?sortBy=a&parsed=2');
    expect(window.location.search).toBe('?sortBy=a&parsed=2');
  });

  it('should use replaceState when replace is set', () => {
    const pushState = jest.spyOn(window.history, 'pushState');
    const replaceState = jest.spyOn(window.history, 'replaceState');
    const { result } = setup({ replace: true });

    act(() => result.current[1]({ sortBy: 'a' }));

    expect(replaceState).toHaveBeenCalledWith(null, '', '/?sortBy=a');
    expect(pushState).not.toHaveBeenCalled();
  });

  it('should let the setter replace override the hook config', () => {
    const pushState = jest.spyOn(window.history, 'pushState');
    const { result } = setup({ replace: true });

    act(() => result.current[1]({ sortBy: 'a' }, { replace: false }));

    expect(pushState).toHaveBeenCalledTimes(1);
  });

  it('should keep both values when the setter is called twice before Next syncs', () => {
    const { result } = setup();

    act(() => {
      result.current[1]({ sortBy: 'a' });
      result.current[1]({ aliased: 'b' });
    });

    expect(window.location.search).toBe('?sortBy=a&aliasName=b');
  });

  it('should not write History when the url would not change', () => {
    window.history.replaceState(null, '', '/?sortBy=a');
    const pushState = jest.spyOn(window.history, 'pushState');
    const { result } = setup();

    act(() => result.current[1]({ sortBy: 'a' }));

    expect(pushState).not.toHaveBeenCalled();
  });
});

function setup(extraConfig?: Parameters<typeof usePageQueryParams>[1]) {
  return renderHook(() => usePageQueryParams(queryParamsConfig, extraConfig));
}
