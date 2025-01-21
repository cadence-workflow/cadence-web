import mockResolvedConfigValues from '../__fixtures__/resolved-config-values';
import { type LoadedConfigResolvedValues } from '../config.types';

export default jest.fn(function <K extends keyof LoadedConfigResolvedValues>(
  key: K
) {
  return Promise.resolve(mockResolvedConfigValues[key]);
});
