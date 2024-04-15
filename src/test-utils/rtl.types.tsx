import type { JSXElementConstructor, ReactNode } from "react";
import type { Props as TestProviderProps } from "./test-provider.types";

export type PublicProviderProps = Omit<TestProviderProps, 'children'>;

export type RenderHookOptions<T> = {
    initialProps?: T;
    wrapper?: JSXElementConstructor<{
      children: ReactNode;
    }>;
  };