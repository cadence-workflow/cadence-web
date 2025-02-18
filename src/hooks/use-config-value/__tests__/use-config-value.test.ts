import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import useConfigValue from '../use-config-value';

describe(useConfigValue.name, () => {
  it('should return correct loading state and result', async () => {
    const { result } = setup({});

    expect(result.current.isLoading).toStrictEqual(true);

    await waitFor(() => {
      const value = result.current.data;
      expect(value).toStrictEqual('mock_config_response');
    });
  });

  it('should return error if the API route errors out', async () => {
    const { result } = setup({ error: true });

    await waitFor(() => {
      const res = result.current;
      expect(res.status).toEqual('error');
    });
  });
});

function setup({ error }: { error?: boolean }) {
  const { result } = renderHook(
    () =>
      // @ts-expect-error - using a nonexistent config value
      useConfigValue('MOCK_CONFIG_VALUE', { arg: 'value' }),
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
    }
  );

  return { result };
}
