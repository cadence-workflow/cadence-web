'use client';
import React, { useMemo, useState } from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import Link from '@/components/link/link';
import PrettyJson from '@/components/pretty-json/pretty-json';
import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import PrettyJsonSkeleton from '@/components/pretty-json-skeleton/pretty-json-skeleton';
import SegmentedControlRounded from '@/components/segmented-control-rounded/segmented-control-rounded';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { jsonTabLabelMap } from './workflow-summary-json-view.constants';
import { cssStyles, overrides } from './workflow-summary-json-view.styles';
import type {
  Props,
  WorkflowSummaryJsonTab,
} from './workflow-summary-json-view.types';

export default function WorkflowSummaryJsonView({
  inputJson,
  resultJson,
  isWorkflowRunning,
  isArchived,
  domain,
  cluster,
  runId,
  workflowId,
  defaultTab = 'input',
  hideTabToggle,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const jsonMap: Record<string, PrettyJsonValue> = useMemo(
    () => ({
      input: inputJson,
      result: resultJson,
    }),
    [inputJson, resultJson]
  );
  const [activeTab, setActiveTab] =
    useState<WorkflowSummaryJsonTab>(defaultTab);

  const textToCopy = useMemo(() => {
    return losslessJsonStringify(jsonMap[activeTab], null, '\t');
  }, [jsonMap, activeTab]);

  return (
    <div className={cls.jsonViewContainer}>
      <div className={cls.jsonViewHeader}>
        {hideTabToggle ? (
          <div className={cls.jsonStaticTitle}>
            {jsonTabLabelMap[activeTab]}
          </div>
        ) : (
          <SegmentedControlRounded
            activeKey={activeTab}
            options={Object.entries(jsonTabLabelMap).map(([key, label]) => ({
              key,
              label,
            }))}
            onChange={({ activeKey }) =>
              setActiveTab(activeKey === 'result' ? 'result' : 'input')
            }
          />
        )}

        <CopyTextButton
          textToCopy={textToCopy}
          overrides={overrides.copyButton}
        />
      </div>
      {activeTab === 'input' && <PrettyJson json={jsonMap[activeTab]} />}
      {activeTab === 'result' && isArchived && (
        <div className={cls.archivedResult}>
          Workflow is archived, result is only available in{' '}
          <Link
            href={`/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/history`}
          >
            history
          </Link>
        </div>
      )}
      {activeTab === 'result' && !isArchived && (
        <>
          {isWorkflowRunning && <PrettyJsonSkeleton width="200px" />}
          {!isWorkflowRunning && <PrettyJson json={jsonMap[activeTab]} />}
        </>
      )}
    </div>
  );
}
