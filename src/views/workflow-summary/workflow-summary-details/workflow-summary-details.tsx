'use client';
import React from 'react';

import { LabelMedium } from 'baseui/typography';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import workflowSummaryDetailsConfig from '../config/workflow-summary-details.config';

import { cssStyles } from './workflow-summary-details.styles';
import { type Props } from './workflow-summary-details.types';

export default function WorkflowSummaryDetails({
  firstHistoryEvent,
  closeHistoryEvent,
  formattedFirstHistoryEvent,
  formattedCloseHistoryEvent,
  decodedPageUrlParams,
  workflowDetails,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <div className={cls.pageContainer}>
      <div>
        <LabelMedium>
          <strong>Workflow: </strong>
          {
            firstHistoryEvent?.workflowExecutionStartedEventAttributes
              ?.workflowType?.name
          }
        </LabelMedium>
      </div>
      <div>
        {workflowSummaryDetailsConfig
          .filter(
            (c) =>
              !c.hide ||
              !c.hide({
                firstEvent: firstHistoryEvent,
                formattedFirstEvent: formattedFirstHistoryEvent,
                formattedCloseEvent: formattedCloseHistoryEvent,
                closeEvent: closeHistoryEvent,
                workflowDetails,
                decodedPageUrlParams,
              })
          )
          .map((c) => (
            <div className={cls.detailsRow} key={c.key}>
              <div className={cls.detailsLabel}>{c.getLabel()}</div>
              <div className={cls.detailsValue}>
                <c.valueComponent
                  firstEvent={firstHistoryEvent}
                  closeEvent={closeHistoryEvent}
                  formattedFirstEvent={formattedFirstHistoryEvent}
                  formattedCloseEvent={formattedCloseHistoryEvent}
                  workflowDetails={workflowDetails}
                  decodedPageUrlParams={decodedPageUrlParams}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
