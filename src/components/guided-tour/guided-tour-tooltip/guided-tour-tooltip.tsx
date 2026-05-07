'use client';
import React, { type SyntheticEvent } from 'react';

import { Button } from 'baseui/button';
import { MdClose } from 'react-icons/md';

import { overrides, styled } from './guided-tour-tooltip.styles';
import { type Props } from './guided-tour-tooltip.types';

type JoyrideButtonProps = Props['closeProps'];
type BaseUIButtonOnClick = (a: SyntheticEvent<HTMLButtonElement>) => unknown;

function adaptButtonProps({ onClick, ...rest }: JoyrideButtonProps) {
  return {
    ...rest,
    onClick: onClick as unknown as BaseUIButtonOnClick,
  };
}

export default function GuidedTourTooltip({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  size,
  step,
  tooltipProps,
}: Props) {
  return (
    <styled.Container {...tooltipProps}>
      <styled.Header>
        {step.title && <styled.Title>{step.title}</styled.Title>}
        <Button
          {...adaptButtonProps(closeProps)}
          size="mini"
          kind="tertiary"
          shape="square"
          overrides={overrides.closeButton}
        >
          <MdClose size={14} />
        </Button>
      </styled.Header>
      <styled.Body>{step.content}</styled.Body>
      <styled.Footer>
        <styled.Progress>
          {index + 1} of {size}
        </styled.Progress>
        <styled.FooterActions>
          {index > 0 && (
            <Button
              {...adaptButtonProps(backProps)}
              size="compact"
              kind="secondary"
            >
              Back
            </Button>
          )}
          <Button
            {...adaptButtonProps(primaryProps)}
            size="compact"
            kind="primary"
          >
            {isLastStep ? 'Done' : 'Next'}
          </Button>
        </styled.FooterActions>
      </styled.Footer>
    </styled.Container>
  );
}
