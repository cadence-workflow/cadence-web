import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';

import useConfigValue from '../use-config-value';

const mockError = jest.fn();
jest.mock('@/utils/logger', () => ({
  __esModule: true,
  default: {
    error: (payload: any, msg: string) => mockError(payload, msg),
  },
}));

describe(useConfigValue.name, () => {
  it('should return correct loading state and result', async () => {
    const { result } = setup({});

    expect(result.current.isLoading).toStrictEqual(true);

    await waitFor(() => {
      const value = result.current.data;
      expect(value).toStrictEqual('mock_config_response');
    });
  });

  it('should log and return error if the API route errors out', async () => {
    const { result } = setup({ error: true });

    await waitFor(() => {
      const res = result.current;
      expect(res.status).toStrictEqual('error');
    });

    expect(mockError).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'MOCK_CONFIG_VALUE',
        error: expect.any(RequestError),
      }),
      'Error fetching dynamic config value'
    );
  });
});

function setup({ error }: { error?: boolean }) {
  const mockGetConfigValue = jest.fn();

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
            mockGetConfigValue();
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

  return { result, mockGetConfigValue };
}
