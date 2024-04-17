import React, { Fragment } from 'react';
import { render, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TestProvider } from './test-provider';

import type { JSXElementConstructor, ReactNode } from 'react';
import { PublicProviderProps, RenderHookOptions } from './rtl.types';

const customRender = (
  element: Parameters<typeof render>[0],
  providerProps?: PublicProviderProps,
  renderOptions?: Parameters<typeof render>[1]
) => {
  const { wrapper } = getWrapper(providerProps, renderOptions);
  return render(element, { ...renderOptions, wrapper });
};

const customRenderHook = <PropsT, ResultT>(
  callback: (props?: PropsT) => ResultT,
  providerProps?: PublicProviderProps,
  renderOptions?: RenderHookOptions<PropsT>
) => {
  const { wrapper } = getWrapper(providerProps, renderOptions);
  return renderHook(callback, {
    wrapper,
    initialProps: renderOptions?.initialProps,
  });
};

const getWrapper = (
  providerProps?: PublicProviderProps,
  renderOptions?: {
    wrapper?: JSXElementConstructor<{
      children: ReactNode;
    }>;
  }
) => {
  const wrapper = ({ children }: { children: ReactNode }) => {
    const WrapperFromTest = renderOptions?.wrapper ?? Fragment;
    return (
      <TestProvider {...providerProps}>
        <WrapperFromTest>{children}</WrapperFromTest>
      </TestProvider>
    );
  };

  return { wrapper };
};

export * from '@testing-library/react';

export { customRender as render };

export { customRenderHook as renderHook };
