'use client';
import React, { useEffect, useMemo, useState } from 'react';

import { Button, KIND as BUTTON_KIND, SHAPE, SIZE } from 'baseui/button';
import { ACCESSIBILITY_TYPE, Tooltip } from 'baseui/tooltip';
import copy from 'copy-to-clipboard';
import { MdCopyAll } from 'react-icons/md';

import PrettyJson from '@/components/pretty-json/pretty-json';

import getQueryJsonContent from './helpers/get-query-json-content';
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

  const { content, isError } = useMemo(
    () => getQueryJsonContent(props),
    [props]
  );

  return (
    <styled.ViewContainer $isError={isError}>
      {content !== undefined && (
        <>
          <PrettyJson json={content} />
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
                copy(JSON.stringify(content, null, '\t'));
                setShowTooltip(true);
              }}
              size={SIZE.compact}
              shape={SHAPE.pill}
              kind={BUTTON_KIND.tertiary}
            >
              <MdCopyAll />
            </Button>
          </Tooltip>
        </>
      )}
    </styled.ViewContainer>
  );
}
