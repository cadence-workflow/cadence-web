'use client';
import React from 'react';

import { Button } from 'baseui/button';
import { MdClose } from 'react-icons/md';

import { overrides, styled } from './guided-tour-tooltip.styles';
import { type Props } from './guided-tour-tooltip.types';

export default function GuidedTourTooltip({
  controls,
  index,
  isLastStep,
  size,
  step,
  tooltipProps,
}: Props) {
  return (
    <styled.Container {...tooltipProps}>
      <styled.Header>
        {step.title && <styled.Title>{step.title}</styled.Title>}
        <Button
          size="mini"
          kind="tertiary"
          shape="square"
          aria-label="Close tour"
          onClick={() => controls.skip()}
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
              size="compact"
              kind="secondary"
              onClick={() => controls.prev()}
            >
              Back
            </Button>
          )}
          <Button size="compact" kind="primary" onClick={() => controls.next()}>
            {isLastStep ? 'Done' : 'Next'}
          </Button>
        </styled.FooterActions>
      </styled.Footer>
    </styled.Container>
  );
}
