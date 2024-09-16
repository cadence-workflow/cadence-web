import { type BaseProviderOverrides } from 'baseui';

const themeProviderOverrides: BaseProviderOverrides = {
  AppContainer: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  },
};

export default themeProviderOverrides;
