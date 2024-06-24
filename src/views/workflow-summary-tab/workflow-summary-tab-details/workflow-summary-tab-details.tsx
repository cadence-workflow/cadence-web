'use client';
import React from 'react';

import { LabelMedium } from 'baseui/typography';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import workflowSummaryTabDetailsConfig from '../config/workflow-summary-tab-details.config';

import { cssStyles } from './workflow-summary-tab-details.styles';
import { type Props } from './workflow-summary-tab-details.types';

export default function WorkflowSummaryTabDetails({
  firstHistoryEvent,
  lastHistoryEvent,
  params,
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
                lastEvent: lastHistoryEvent,
                params,
              })
          )
          .map((c) => (
            <div className={cls.detailsRow} key={c.key}>
              <div className={cls.detailsLabel}>{c.getLabel()}</div>
              <div className={cls.detailsValue}>
                <c.valueComponent
                  firstEvent={firstHistoryEvent}
                  lastEvent={lastHistoryEvent}
                  params={params}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
