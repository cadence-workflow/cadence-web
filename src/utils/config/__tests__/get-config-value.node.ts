import { type LoadedConfigs } from '../config.types';
import getConfigValue from '../get-config-value';
import { loadedGlobalConfigs } from '../global-configs-ref';

jest.mock('../global-configs-ref', () => ({
  loadedGlobalConfigs: {
    COMPUTED: jest.fn(),
    CADENCE_WEB_PORT: 'someValue',
  } satisfies Partial<LoadedConfigs>,
}));

describe('getConfigValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the value directly if it is not a function', async () => {
    const result = await getConfigValue('CADENCE_WEB_PORT');
    expect(result).toBe('someValue');
  });

  it('calls the function with the provided argument and returns the result', async () => {
    const mockFn = loadedGlobalConfigs.COMPUTED as jest.Mock;
    mockFn.mockResolvedValue('resolvedValue');

    const result = await getConfigValue('COMPUTED', ['arg']);
    expect(mockFn).toHaveBeenCalledWith(['arg']);
    expect(result).toBe('resolvedValue');
  });
});
