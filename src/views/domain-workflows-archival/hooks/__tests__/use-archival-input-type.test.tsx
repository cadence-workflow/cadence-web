import React, { Suspense } from 'react';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type UseSuspenseConfigValueResult } from '@/hooks/use-config-value/use-config-value.types';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';

import useArchivalInputType from '../use-archival-input-type';

jest.mock('@/hooks/use-page-query-params/use-page-query-params');
jest.mock('@/hooks/use-config-value/use-suspense-config-value');

const mockUsePageQueryParams = usePageQueryParams as jest.MockedFunction<any>;
const mockUseSuspenseConfigValue =
  useSuspenseConfigValue as jest.MockedFunction<any>;

describe(useArchivalInputType.name, () => {
  it('should return forceQueryInputOnly as false when archival default search is enabled', async () => {
    const { result } = setup({ archivalDefaultSearchEnabled: true });

    await waitFor(() => {
      expect(result.current.forceQueryInputOnly).toBe(false);
    });
  });

  it('should return forceQueryInputOnly as true when archival default search is disabled', async () => {
    const { result } = setup({ archivalDefaultSearchEnabled: false });

    await waitFor(() => {
      expect(result.current.forceQueryInputOnly).toBe(true);
    });
  });

  it('should return inputType from queryParams.inputTypeArchival when archival default search is enabled', async () => {
    const { result } = setup({
      archivalDefaultSearchEnabled: true,
      inputTypeArchivalQueryParamValue: 'search',
    });

    await waitFor(() => {
      expect(result.current.inputType).toBe('search');
    });

    const { result: result2 } = setup({
      archivalDefaultSearchEnabled: true,
      inputTypeArchivalQueryParamValue: 'query',
    });

    await waitFor(() => {
      expect(result2.current.inputType).toBe('query');
    });
  });

  it('should always return inputType as query when archival default search is disabled', async () => {
    const { result } = setup({
      archivalDefaultSearchEnabled: false,
      inputTypeArchivalQueryParamValue: 'search',
    });

    await waitFor(() => {
      expect(result.current.inputType).toBe('query');
    });
  });

  it('should ignore queryParams.inputTypeArchivalQueryParamValue when archival default search is disabled', async () => {
    const { result } = setup({
      archivalDefaultSearchEnabled: false,
      inputTypeArchivalQueryParamValue: 'query',
    });

    await waitFor(() => {
      expect(result.current.inputType).toBe('query');
    });
  });

  it('should return an object with forceQueryInputOnly and inputType properties', async () => {
    const { result } = setup({
      archivalDefaultSearchEnabled: true,
      inputTypeArchivalQueryParamValue: 'search',
    });

    await waitFor(() => {
      expect(result.current).toHaveProperty('forceQueryInputOnly');
      expect(result.current).toHaveProperty('inputType');
      expect(typeof result.current.forceQueryInputOnly).toBe('boolean');
      expect(['search', 'query']).toContain(result.current.inputType);
    });
  });
});

function setup({
  archivalDefaultSearchEnabled = true,
  inputTypeArchivalQueryParamValue = 'search',
}: {
  archivalDefaultSearchEnabled?: boolean;
  inputTypeArchivalQueryParamValue?: 'search' | 'query';
}) {
  mockUsePageQueryParams.mockReturnValue([
    {
      inputTypeArchival: inputTypeArchivalQueryParamValue,
    },
    jest.fn(),
  ]);

  mockUseSuspenseConfigValue.mockReturnValue({
    data: archivalDefaultSearchEnabled,
  } satisfies Pick<
    UseSuspenseConfigValueResult<'ARCHIVAL_DEFAULT_SEARCH_ENABLED'>,
    'data'
  >);

  const { result } = renderHook(() => useArchivalInputType(), undefined, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <Suspense>{children}</Suspense>
    ),
  });

  return { result };
}
