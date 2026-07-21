'use client';
import React from 'react';

import Link from '@/components/link/link';
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import useStyletronClasses from '@/hooks/use-styletron-classes';

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

  const scheduleTimeValue = searchAttributes?.CadenceScheduleTime;
  const scheduleTime =
    typeof scheduleTimeValue === 'string' ? scheduleTimeValue : '-';
  const isBackfill = searchAttributes?.CadenceScheduleIsBackfill === true;
  const backfillIdValue = searchAttributes?.CadenceScheduleBackfillID;
  const backfillId =
    isBackfill && typeof backfillIdValue === 'string' ? backfillIdValue : null;

  return (
    <div className={cls.pageContainer}>
      <div className={cls.workflowTitle}>
        <strong>Schedule details</strong>
      </div>
      <div aria-label="Schedule details" role="table">
        <div className={cls.detailsRow} role="row">
          <div className={cls.detailsLabel} role="rowheader">
            Schedule ID
          </div>
          <div className={cls.detailsValue} role="cell">
            <Link
              href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/schedules/${encodeURIComponent(scheduleId)}/details`}
            >
              {scheduleId}
            </Link>
          </div>
        </div>
        <div className={cls.detailsRow} role="row">
          <div className={cls.detailsLabel} role="rowheader">
            Schedule time
          </div>
          <div className={cls.detailsValue} role="cell">
            {scheduleTime}
          </div>
        </div>
        <div className={cls.detailsRow} role="row">
          <div className={cls.detailsLabel} role="rowheader">
            Backfill
          </div>
          <div className={cls.detailsValue} role="cell">
            {isBackfill ? 'Yes' : 'No'}
          </div>
        </div>
        {backfillId && (
          <div className={cls.detailsRow} role="row">
            <div className={cls.detailsLabel} role="rowheader">
              Backfill ID
            </div>
            <div className={cls.detailsValue} role="cell">
              <Link
                href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?input=query&query=${encodeURIComponent(`CadenceScheduleBackfillID="${backfillId}"`)}`}
              >
                {backfillId}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
