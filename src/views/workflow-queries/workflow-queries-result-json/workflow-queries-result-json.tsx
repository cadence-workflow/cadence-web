'use client';
import React, { useEffect, useState } from 'react';

import { Button, KIND as BUTTON_KIND, SHAPE, SIZE } from 'baseui/button';
import { ACCESSIBILITY_TYPE, Tooltip } from 'baseui/tooltip';
import copy from 'copy-to-clipboard';
import { MdCopyAll } from 'react-icons/md';

import PrettyJson from '@/components/pretty-json/pretty-json';

import { styled } from './workflow-queries-result-json.styles';
import { type Props } from './workflow-queries-result-json.types';

export default function WorkflowQueriesResultJson(props: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  return (
    <styled.ViewContainer>
      <PrettyJson json={props.data} />
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
            copy(JSON.stringify(props.data, null, '\t'));
            setShowTooltip(true);
          }}
          size={SIZE.compact}
          shape={SHAPE.pill}
          kind={BUTTON_KIND.secondary}
        >
          <MdCopyAll />
        </Button>
      </Tooltip>
    </styled.ViewContainer>
  );
}
