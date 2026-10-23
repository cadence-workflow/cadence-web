import { renderHook, act } from '@/test-utils/rtl';

import { queryParamsConfig } from '../__fixtures__/page-query-params.fixtures';
import usePageQueryParams from '../use-page-query-params';

let mockSearchParams = new URLSearchParams();
let mockPathname = '/';
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => mockPathname,
}));

describe('usePageQueryParams', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockSearchParams = new URLSearchParams();
    mockPathname = '/';
    window.history.replaceState(null, '', '/');
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
    delete process.env.__NEXT_ROUTER_BASEPATH;
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

  it('should seed from the url on mount when Next params are stale on a null-state entry', () => {
    window.history.replaceState(null, '', '/?sortBy=fromUrl');
    mockSearchParams = new URLSearchParams('sortBy=stale');
    const { result } = setup();
    expect(result.current[0].sortBy).toBe('fromUrl');
  });

  it('should start with Next params before reading a delayed location change', () => {
    window.history.replaceState({ __NA: true }, '', '/?sortBy=fromUrl');
    mockSearchParams = new URLSearchParams('sortBy=fromNext');
    const { result } = setup();
    expect(result.current[0].sortBy).toBe('fromNext');

    act(() => jest.advanceTimersByTime(60));
    expect(result.current[0].sortBy).toBe('fromUrl');
  });

  it('should follow Next navigation before the url bar lands', () => {
    const { result, rerender } = setup();
    act(() => {
      mockSearchParams = new URLSearchParams('sortBy=linked');
    });
    rerender();
    expect(result.current[0].sortBy).toBe('linked');
  });

  it('should read History changes that do not emit an event', () => {
    const { result } = setup();
    act(() => {
      window.history.replaceState({ __NA: true }, '', '/?sortBy=stamped');
    });
    act(() => jest.advanceTimersByTime(60));
    expect(result.current[0].sortBy).toBe('stamped');
  });

  it('should recheck for a late History change', () => {
    const { result } = setup();
    act(() => jest.advanceTimersByTime(60));
    act(() => {
      window.history.replaceState({ __NA: true }, '', '/?sortBy=late');
    });
    act(() => jest.advanceTimersByTime(200));
    expect(result.current[0].sortBy).toBe('late');
  });

  it('should replace stale Next params with location params', () => {
    const { result, rerender } = setup();
    act(() => {
      mockSearchParams = new URLSearchParams('sortBy=phantom');
    });
    rerender();
    expect(result.current[0].sortBy).toBe('phantom');

    act(() => jest.advanceTimersByTime(60));
    expect(result.current[0].sortBy).toBeUndefined();
  });

  it('should not write when the url bar shows another route', () => {
    window.history.replaceState(null, '', '/other');
    const pushState = jest.spyOn(window.history, 'pushState');
    const { result } = setup();

    act(() => result.current[1]({ sortBy: 'a' }));

    expect(pushState).not.toHaveBeenCalled();
  });

  it('should not sync when History drops the write', () => {
    const { result: a } = setup();
    const { result: b } = setup();
    jest.spyOn(window.history, 'pushState').mockImplementation(() => {});

    act(() => a.current[1]({ sortBy: 'dropped' }));

    expect(b.current[0].sortBy).toBeUndefined();
  });

  it('should keep the hash on writes', () => {
    window.history.replaceState(null, '', '/?sortBy=a#frag');
    const { result } = setup();

    act(() => result.current[1]({ sortBy: 'b' }));

    expect(window.location.search + window.location.hash).toBe(
      '?sortBy=b#frag'
    );
  });

  describe('basePath', () => {
    beforeEach(() => {
      process.env.__NEXT_ROUTER_BASEPATH = '/qp';
      window.history.replaceState(null, '', '/qp/');
    });

    it('should compare and write against the prefixed pathname', () => {
      const { result } = setup();

      act(() => result.current[1]({ sortBy: 'a' }));

      expect(window.location.pathname + window.location.search).toBe(
        '/qp/?sortBy=a'
      );
    });

    it('should seed from the url on mount with the prefix present', () => {
      window.history.replaceState(null, '', '/qp/?sortBy=fromUrl');
      mockSearchParams = new URLSearchParams('sortBy=stale');
      const { result } = setup();
      expect(result.current[0].sortBy).toBe('fromUrl');
    });
  });
});

function setup(extraConfig?: Parameters<typeof usePageQueryParams>[1]) {
  return renderHook(() => usePageQueryParams(queryParamsConfig, extraConfig));
}
