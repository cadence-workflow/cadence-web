'use client';
import React, { useEffect, useState } from 'react';

import { Button, KIND as BUTTON_KIND, SHAPE, SIZE } from 'baseui/button';
import { ACCESSIBILITY_TYPE, Tooltip } from 'baseui/tooltip';
import copy from 'copy-to-clipboard';
import { MdCopyAll } from 'react-icons/md';

import PrettyJson from '@/components/pretty-json/pretty-json';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './workflow-history-event-details-json.styles';
import type { Props } from './workflow-history-event-details-json.types';

export default function WorkflowHistoryEventDetailsJson({ entryValue }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
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
    <div className={cls.jsonViewWrapper}>
      <div className={cls.jsonViewContainer}>
        <div className={cls.jsonViewHeader}>
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
                copy(JSON.stringify(entryValue, null, '\t'));
                setShowTooltip(true);
              }}
              size={SIZE.mini}
              shape={SHAPE.circle}
              kind={BUTTON_KIND.secondary}
            >
              <MdCopyAll />
            </Button>
          </Tooltip>
        </div>
        <PrettyJson json={entryValue} />
      </div>
    </div>
  );
}
