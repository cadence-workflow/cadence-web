import React, { forwardRef } from 'react';

import { Button as BaseButton } from 'baseui/button';
import { mergeOverrides } from 'baseui/helpers/overrides';

import { overrides as getOverrides, styled } from './button.styles';
import { type Props } from './button.types';

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      loadingIndicatorType = 'spinner',
      overrides: externalOverrides = {},
      ...props
    },
    ref
  ) => {
    const isSkeletonLoading =
      props.isLoading === true && loadingIndicatorType === 'skeleton';
    const overrides = getOverrides(isSkeletonLoading);
    const skeletonLoadingProps = {
      ['aria-label']:
        typeof props.children === 'string'
          ? `loading ${props.children}`
          : 'content is loading',
      ['aria-busy']: true,
      ['aria-live']: 'polite' as const,
      isLoading: false,
      onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
      },
    };

    return (
      <BaseButton
        ref={ref}
        {...props}
        {...(isSkeletonLoading ? skeletonLoadingProps : {})}
        overrides={mergeOverrides(overrides.button, externalOverrides)}
      >
        {isSkeletonLoading && (
          <styled.SkeletonLoader data-testid="skeleton-loader" />
        )}
        {props.children}
      </BaseButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
