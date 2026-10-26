import { NextRequest } from 'next/server';

import getConfigValue from '@/utils/config/get-config-value';

import getConfig from '../get-config';

jest.mock('@/utils/config/get-config-value');

describe('getConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if the config key is not a public config key', async () => {
    const { res } = await setup({
      configKey: 'testKey',
      jsonArgs: '',
    });
    const responseJson = await res.json();
    expect(res.status).toBe(400);
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for config key/args',
      })
    );
  });

  it('should return config value if query parameters are valid', async () => {
    (getConfigValue as jest.Mock).mockResolvedValue('value');

    const { res } = await setup({
      configKey: 'CLUSTERS_PUBLIC',
      jsonArgs: '',
    });

    expect(getConfigValue).toHaveBeenCalledWith('CLUSTERS_PUBLIC', undefined);
    const responseJson = await res.json();
    expect(responseJson).toEqual('value');
  });

  it('should handle errors from getConfigValue', async () => {
    (getConfigValue as jest.Mock).mockRejectedValue(new Error('Config error'));

    await expect(
      setup({
        configKey: 'CLUSTERS_PUBLIC',
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
