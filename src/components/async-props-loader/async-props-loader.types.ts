import { JSXElementConstructor, JSX } from 'react';

export type AsyncLoaderComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export type Props<Component extends AsyncLoaderComponent> = {
  component: Component;
  getAsyncProps: () => Promise<React.ComponentProps<Component>>;
};
