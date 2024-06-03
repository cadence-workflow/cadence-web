'use client';
import React, { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { MdCopyAll } from 'react-icons/md';
import { Button, KIND as BUTTON_KIND, SHAPE, SIZE } from 'baseui/button';
import { ACCESSIBILITY_TYPE, Tooltip } from 'baseui/tooltip';
import SegmentedControlRounded from '@/components/segmented-control-rounded/segmented-control-rounded';
import PrettyJson from '@/components/pretty-json/pretty-json';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { jsonViewTabsOptions } from './workflow-summary-tab-json-view.constants';
import type { Props } from './workflow-summary-tab-json-view.types';
import { JsonValue } from '@/components/pretty-json/pretty-json.types';
import { cssStyles } from './workflow-summary-tab-json-view.styles';

export default function WorkflowSummaryTabJsonView({
  inputJson,
  resultJson,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const [showTooltip, setShowTooltip] = useState(false);
  const jsonMap: Record<string, JsonValue> = {
    input: inputJson,
    result: resultJson,
  };
  const [activeTab, setActiveTab] = useState<string>(
    jsonViewTabsOptions[0].key
  );

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);
  return (
    <div className={cls.jsonViewContainer}>
      <div className={cls.jsonViewHeader}>
        <SegmentedControlRounded
          activeKey={activeTab}
          options={jsonViewTabsOptions}
          onChange={({ activeKey }) => setActiveTab(activeKey.toString())}
        />
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
              copy(JSON.stringify(jsonMap[activeTab], null, '\t'));
              setShowTooltip(true);
            }}
            size={SIZE.mini}
            shape={SHAPE.pill}
            kind={BUTTON_KIND.secondary}
            startEnhancer={<MdCopyAll />}
          >
            Copy
          </Button>
        </Tooltip>
      </div>
      <PrettyJson json={jsonMap[activeTab]} />
    </div>
  );
}
