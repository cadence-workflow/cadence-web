'use client';
import React, { useEffect, useState } from 'react';

import { Button, SHAPE, SIZE, KIND } from 'baseui/button';
import { ACCESSIBILITY_TYPE, Tooltip } from 'baseui/tooltip';
import copy from 'copy-to-clipboard';
import { MdCopyAll } from 'react-icons/md';

import type { Props } from './copy-text-button.types';

export default function CopyTextButton({
  textToCopy,
  children,
  ...buttonProps
}: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  const buttonChildren = children === undefined ? <MdCopyAll /> : children;

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);
  return (
    <Tooltip
      animateOutTime={400}
      isOpen={showTooltip}
      showArrow
      placement="bottom"
      accessibilityType={ACCESSIBILITY_TYPE.tooltip}
      content={() => <>Copied</>}
    >
      <Button
        onClick={() => {
          copy(textToCopy);
          setShowTooltip(true);
        }}
        size={SIZE.mini}
        shape={SHAPE.circle}
        kind={KIND.secondary}
        {...buttonProps}
      >
        {buttonChildren}
      </Button>
    </Tooltip>
  );
}
