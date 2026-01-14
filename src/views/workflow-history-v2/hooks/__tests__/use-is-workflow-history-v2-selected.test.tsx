import React, { Suspense } from 'react';

import { renderHook, waitFor, act } from '@/test-utils/rtl';

import { type UseSuspenseConfigValueResult } from '@/hooks/use-config-value/use-config-value.types';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import * as localStorageModule from '@/utils/local-storage';
import workflowHistoryUserPreferencesConfig from '@/views/workflow-history/config/workflow-history-user-preferences.config';

import useIsWorkflowHistoryV2Selected from '../use-is-workflow-history-v2-selected';

jest.mock('@/hooks/use-config-value/use-suspense-config-value');
jest.mock('@/utils/local-storage', () => ({
  getLocalStorageValue: jest.fn(),
  setLocalStorageValue: jest.fn(),
  clearLocalStorageValue: jest.fn(),
}));

const mockUseSuspenseConfigValue =
  useSuspenseConfigValue as jest.MockedFunction<any>;

describe(useIsWorkflowHistoryV2Selected.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return true when config value is ENABLED', async () => {
    const { result } = setup({ configValue: 'ENABLED' });

    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });
  });

  it('should return true when config value is OPT_OUT', async () => {
    const { result } = setup({ configValue: 'OPT_OUT' });

    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });
  });

  it('should return false when config value is DISABLED', async () => {
    const { result } = setup({ configValue: 'DISABLED' });

    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });
  });

  it('should return false when config value is OPT_IN and localStorage has no value', async () => {
    const { result } = setup({ configValue: 'OPT_IN' });

    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });
  });

  it('should return true when config value is OPT_IN and localStorage has true', async () => {
    const { result } = setup({
      configValue: 'OPT_IN',
      localStorageValue: true,
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });
  });

  it('should return false when config value is OPT_IN and localStorage has false', async () => {
    const { result } = setup({
      configValue: 'OPT_IN',
      localStorageValue: false,
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });
  });

  it('should not allow setting value when config is DISABLED', async () => {
    const { result, mockSetLocalStorageValue } = setup({
      configValue: 'DISABLED',
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(false);
    expect(mockSetLocalStorageValue).not.toHaveBeenCalled();
  });

  it('should not allow setting value when config is ENABLED', async () => {
    const { result, mockSetLocalStorageValue } = setup({
      configValue: 'ENABLED',
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });

    act(() => {
      result.current[1](false);
    });

    expect(result.current[0]).toBe(true);
    expect(mockSetLocalStorageValue).not.toHaveBeenCalled();
  });

  it('should allow setting value when config is OPT_OUT', async () => {
    const { result, mockSetLocalStorageValue } = setup({
      configValue: 'OPT_OUT',
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });

    act(() => {
      result.current[1](false);
    });

    expect(result.current[0]).toBe(false);
    expect(mockSetLocalStorageValue).not.toHaveBeenCalled();
  });

  it('should allow setting value and update localStorage when config is OPT_IN', async () => {
    const { result, mockSetLocalStorageValue } = setup({
      configValue: 'OPT_IN',
      localStorageValue: false,
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(mockSetLocalStorageValue).toHaveBeenCalledWith(
      workflowHistoryUserPreferencesConfig.historyV2ViewEnabled.key,
      'true'
    );
  });

  it('should update localStorage when setting value to false in OPT_IN mode', async () => {
    const { result, mockSetLocalStorageValue } = setup({
      configValue: 'OPT_IN',
      localStorageValue: true,
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });

    act(() => {
      result.current[1](false);
    });

    expect(result.current[0]).toBe(false);
    expect(mockSetLocalStorageValue).toHaveBeenCalledWith(
      workflowHistoryUserPreferencesConfig.historyV2ViewEnabled.key,
      'false'
    );
  });
});

function setup({
  configValue,
  localStorageValue,
}: {
  configValue: 'DISABLED' | 'OPT_IN' | 'OPT_OUT' | 'ENABLED';
  localStorageValue?: boolean | null;
}) {
  mockUseSuspenseConfigValue.mockReturnValue({
    data: configValue,
  } satisfies Pick<
    UseSuspenseConfigValueResult<'HISTORY_PAGE_V2_ENABLED'>,
    'data'
  >);

  const mockGetLocalStorageValue = jest.fn(() => localStorageValue ?? null);
  const mockSetLocalStorageValue = jest.fn();

  jest
    .spyOn(localStorageModule, 'getLocalStorageValue')
    .mockImplementation(mockGetLocalStorageValue);
  jest
    .spyOn(localStorageModule, 'setLocalStorageValue')
    .mockImplementation(mockSetLocalStorageValue);

  const { result } = renderHook(
    () => useIsWorkflowHistoryV2Selected(),
    undefined,
    {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Suspense>{children}</Suspense>
      ),
    }
  );

  return { result, mockGetLocalStorageValue, mockSetLocalStorageValue };
}
