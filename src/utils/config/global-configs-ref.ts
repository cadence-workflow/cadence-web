import GlobalRef from '../global-ref';

import { type LoadedConfigs } from './config.types';

const globalConfigRef = new GlobalRef<LoadedConfigs>('cadence-config');
const setLoadedGlobalConfigs = (c: LoadedConfigs): void => {
  globalConfigRef.value = c;
};

const getLoadedGlobalConfigs = (): LoadedConfigs => {
  return globalConfigRef.value;
};

export { getLoadedGlobalConfigs, setLoadedGlobalConfigs };
