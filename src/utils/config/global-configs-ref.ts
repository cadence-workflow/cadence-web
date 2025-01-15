import { type LoadedConfigs } from './config.types';
import GlobalRef from './global-ref';

const globalConfigRef = new GlobalRef<LoadedConfigs>('cadence-config');
const setLoadedGlobalConfigs = (c: LoadedConfigs): void => {
  globalConfigRef.value = c;
};

const loadedGlobalConfigs: LoadedConfigs = globalConfigRef.value;
export { loadedGlobalConfigs, setLoadedGlobalConfigs };
