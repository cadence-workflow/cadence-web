'use client';
import React from 'react';

import { KIND } from 'baseui/button';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import workflowSummaryDetailsConfig from '../config/workflow-summary-details.config';

import { cssStyles, overrides } from './workflow-summary-details.styles';
import {
  type Props,
  type WorkflowSummaryFieldArgs,
} from './workflow-summary-details.types';

export default function WorkflowSummaryDetails({
  firstHistoryEvent,
  closeHistoryEvent,
  formattedFirstHistoryEvent,
  formattedCloseHistoryEvent,
  decodedPageUrlParams,
  workflowDetails,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  const fieldArgs: WorkflowSummaryFieldArgs = {
    firstEvent: firstHistoryEvent,
    closeEvent: closeHistoryEvent,
    formattedFirstEvent: formattedFirstHistoryEvent,
    formattedCloseEvent: formattedCloseHistoryEvent,
    workflowDetails,
    decodedPageUrlParams,
  };

  return (
    <div className={cls.pageContainer}>
      <div className={cls.workflowTitle}>
        <strong>Workflow: </strong>
        {
          firstHistoryEvent?.workflowExecutionStartedEventAttributes
            ?.workflowType?.name
        }
      </div>
      <div>
        {workflowSummaryDetailsConfig
          .filter((c) => !c.hide || !c.hide(fieldArgs))
          .map((c) => {
            const copyText = c.getCopyText?.(fieldArgs);
            return (
              <div className={cls.detailsRow} key={c.key}>
                <div className={cls.detailsLabel}>{c.getLabel()}</div>
                <div className={cls.detailsValue}>
                  <c.valueComponent {...fieldArgs} />
                  {copyText && (
                    <span className={cls.copyButton} data-copy-button>
                      <CopyTextButton
                        textToCopy={copyText}
                        aria-label={`Copy ${c.getLabel()}`}
                        kind={KIND.tertiary}
                        overrides={overrides.copyButton}
                      />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
