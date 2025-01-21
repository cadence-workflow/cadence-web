import { NextRequest } from 'next/server';

import getConfigValue from '@/utils/config/get-config-value';

import getConfig from '../get-config';
import getConfigValueQueryParamsSchema from '../schemas/get-config-query-params-schema';

jest.mock('../schemas/get-config-query-params-schema');
jest.mock('@/utils/config/get-config-value');

describe('getConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if query parameters are invalid', async () => {
    (getConfigValueQueryParamsSchema.safeParse as jest.Mock).mockReturnValue({
      data: null,
      error: { errors: ['Invalid query parameters'] },
    });

    const { res } = await setup({
      configKey: 'testKey',
      jsonArgs: '',
    });
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for config key/args',
      })
    );
  });

  it('should return config value if query parameters are valid', async () => {
    (getConfigValueQueryParamsSchema.safeParse as jest.Mock).mockReturnValue({
      data: { configKey: 'testKey', jsonArgs: '{}' },
      error: null,
    });
    (getConfigValue as jest.Mock).mockResolvedValue('value');

    const { res } = await setup({
      configKey: 'testKey',
      jsonArgs: '{}',
    });

    expect(getConfigValue).toHaveBeenCalledWith('testKey', '{}');
    const responseJson = await res.json();
    expect(responseJson).toEqual('value');
  });

  it('should handle errors from getConfigValue', async () => {
    (getConfigValueQueryParamsSchema.safeParse as jest.Mock).mockReturnValue({
      data: { configKey: 'testKey', jsonArgs: '{}' },
      error: null,
    });
    (getConfigValue as jest.Mock).mockRejectedValue(new Error('Config error'));

    await expect(
      setup({
        configKey: 'testKey',
        jsonArgs: '',
      })
    ).rejects.toThrow('Config error');
  });
});

async function setup({
  configKey,
  jsonArgs,
}: {
  configKey: string;
  jsonArgs: string;
  error?: true;
}) {
  const res = await getConfig(
    new NextRequest(
      `http://localhost?configKey=${configKey}&jsonArgs=${jsonArgs}`,
      {
        method: 'GET',
      }
    )
  );

  return { res };
}
