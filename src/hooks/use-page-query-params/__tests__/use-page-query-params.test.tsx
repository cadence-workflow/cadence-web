import { renderHook, act } from '@/test-utils/rtl';

import { queryParamsConfig } from '../__fixtures__/page-query-params.fixtures';
import usePageQueryParams from '../use-page-query-params';

jest.mock('next/navigation', () => require('next-router-mock/navigation'));

describe('usePageQueryParams', () => {
  const originalWindowLocation = window.location;
  beforeEach(() => {
    jest.resetAllMocks();
    // Reset the shared next-router-mock URL so searchParams don't leak between
    // tests (the hook now reads searchParams on first render when populated).
    require('next-router-mock').memoryRouter.setCurrentUrl('/');
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
      writable: true,
    });
  });

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

  it('should get search values from window.location.search on first client side render', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalWindowLocation,
        search: '?sortBy=sortByValue1',
      },
      writable: true,
    });

    const { result } = renderHook(() => usePageQueryParams(queryParamsConfig));
    const [values] = result.current;

    expect(values).toStrictEqual({
      sortBy: 'sortByValue1',
      aliased: undefined,
      defaulted: 'defaultValue',
      parsed: undefined,
      parsedMultiVal: undefined,
      multiValDefaulted: ['a'],
    });
  });

  it('prefers searchParams over a lagging window.location on first render (cross-tab navigation)', () => {
    // Router navigation just committed: searchParams already has the new value,
    // but window.location.search still shows the previous (empty) URL. The hook
    // must read searchParams, otherwise it stays stuck on the stale value since
    // searchParams won't change again to trigger a re-read.
    require('next-router-mock').memoryRouter.setCurrentUrl('?sortBy=fromParams');
    Object.defineProperty(window, 'location', {
      value: { ...originalWindowLocation, search: '' },
      writable: true,
    });

    const { result } = renderHook(() => usePageQueryParams(queryParamsConfig));
    const [values] = result.current;

    expect(values.sortBy).toBe('fromParams');
  });

  it('reads window.location (not stale searchParams) after a pushState-only update when a new consumer mounts', () => {
    // The router (and useSearchParams) knows the URL as ?sortBy=stale.
    require('next-router-mock').memoryRouter.setCurrentUrl('/?sortBy=stale');

    // jsdom rejects the production code's unbound window.history.pushState call,
    // so stub it and simulate the URL it would have written.
    const pushStateSpy = jest
      .spyOn(window.history, 'pushState')
      .mockImplementation(() => {});

    const { result: existing } = renderHook(() =>
      usePageQueryParams(queryParamsConfig)
    );

    // The pageRerender:false update records its href in the shared stateUrl;
    // window.location now reflects the new URL while searchParams stays stale
    // (useSearchParams does not track pushState).
    Object.defineProperty(window, 'location', {
      value: { ...originalWindowLocation, search: '?sortBy=fresh' },
      writable: true,
    });
    act(() => {
      existing.current[1]({ sortBy: 'fresh' }, { pageRerender: false });
    });

    // A brand new consumer mounting afterwards must read the fresh URL from
    // window.location, not the stale searchParams.
    const { result: fresh } = renderHook(() =>
      usePageQueryParams(queryParamsConfig)
    );

    expect(fresh.current[0].sortBy).toBe('fresh');

    pushStateSpy.mockRestore();
  });
});
