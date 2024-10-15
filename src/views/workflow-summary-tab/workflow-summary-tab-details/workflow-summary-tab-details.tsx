'use client';
import React from 'react';

import { LabelMedium } from 'baseui/typography';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import workflowSummaryTabDetailsConfig from '../config/workflow-summary-tab-details.config';

import { cssStyles } from './workflow-summary-tab-details.styles';
import { type Props } from './workflow-summary-tab-details.types';

export default function WorkflowSummaryTabDetails({
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
        {workflowSummaryTabDetailsConfig
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
