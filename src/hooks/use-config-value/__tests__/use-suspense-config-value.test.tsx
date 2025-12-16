import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { act, renderHook, waitFor } from '@/test-utils/rtl';

import useSuspenseConfigValue from '../use-suspense-config-value';

describe(useSuspenseConfigValue.name, () => {
  it('should return correct result when data is loaded', async () => {
    const { result } = setup({});

    await waitFor(() => {
      const value = result.current.data;
      expect(value).toStrictEqual('mock_config_response');
    });
  });

  it('should throw error if the API route errors out', async () => {
    let renderErrorMessage;
    try {
      await act(async () => {
        setup({ error: true });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch config');
  });
});

function setup({ error }: { error?: boolean }) {
  const { result } = renderHook(
    () => {
      // @ts-expect-error - using a nonexistent config value
      return useSuspenseConfigValue('MOCK_CONFIG_VALUE', { arg: 'value' });
    },
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch config' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json('mock_config_response');
            }
          },
        },
      ],
    },
    {
      wrapper: ({ children }) => <Suspense>{children}</Suspense>,
    }
  );

  return { result };
}
