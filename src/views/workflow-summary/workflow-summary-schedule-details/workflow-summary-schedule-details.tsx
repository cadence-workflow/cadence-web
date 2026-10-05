'use client';
import React from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import workflowSummaryScheduleDetailsConfig from '../config/workflow-summary-schedule-details.config';
import { cssStyles } from '../workflow-summary-details/workflow-summary-details.styles';

import { type Props } from './workflow-summary-schedule-details.types';

export default function WorkflowSummaryScheduleDetails({
  cluster,
  domain,
  searchAttributes,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const { data: isSchedulesEnabled } = useConfigValue('SCHEDULES_ENABLED', {
    cluster,
    domain,
  });
  const scheduleIdValue = searchAttributes?.CadenceScheduleID;
  const scheduleId =
    typeof scheduleIdValue === 'string' ? scheduleIdValue : null;

  if (!isSchedulesEnabled || !scheduleId) {
    return null;
  }

  const rowArgs = { cluster, domain, scheduleId, searchAttributes };

  return (
    <div className={cls.pageContainer}>
      <div className={cls.workflowTitle}>
        <strong>Schedule details</strong>
      </div>
      <div aria-label="Schedule details" role="table">
        {workflowSummaryScheduleDetailsConfig
          .filter((row) => !row.hide || !row.hide(rowArgs))
          .map((row) => (
            <div className={cls.detailsRow} key={row.key} role="row">
              <div className={cls.detailsLabel} role="rowheader">
                {row.getLabel()}
              </div>
              <div className={cls.detailsValue} role="cell">
                {row.getValue(rowArgs)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
