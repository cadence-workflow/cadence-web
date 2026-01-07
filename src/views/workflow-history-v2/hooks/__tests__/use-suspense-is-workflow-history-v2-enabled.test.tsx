import React, { Suspense } from 'react';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type UseSuspenseConfigValueResult } from '@/hooks/use-config-value/use-config-value.types';
import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';

import useSuspenseIsWorkflowHistoryV2Enabled from '../use-suspense-is-workflow-history-v2-enabled';

jest.mock('@/hooks/use-config-value/use-suspense-config-value');

const mockUseSuspenseConfigValue =
  useSuspenseConfigValue as jest.MockedFunction<any>;

describe(useSuspenseIsWorkflowHistoryV2Enabled.name, () => {
  it('should return true when config value is ENABLED', async () => {
    const { result } = setup({ configValue: 'ENABLED' });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should return true when config value is OPT_OUT', async () => {
    const { result } = setup({ configValue: 'OPT_OUT' });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should return false when config value is DISABLED', async () => {
    const { result } = setup({ configValue: 'DISABLED' });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should return false when config value is OPT_IN', async () => {
    const { result } = setup({ configValue: 'OPT_IN' });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});

function setup({
  configValue,
}: {
  configValue: 'DISABLED' | 'OPT_IN' | 'OPT_OUT' | 'ENABLED';
}) {
  mockUseSuspenseConfigValue.mockReturnValue({
    data: configValue,
  } satisfies Pick<
    UseSuspenseConfigValueResult<'HISTORY_PAGE_V2_ENABLED'>,
    'data'
  >);

  const { result } = renderHook(
    () => useSuspenseIsWorkflowHistoryV2Enabled(),
    undefined,
    {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Suspense>{children}</Suspense>
      ),
    }
  );

  return { result };
}
