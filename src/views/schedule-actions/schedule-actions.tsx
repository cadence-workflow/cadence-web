'use client';
import React, { useState } from 'react';

import {
  StatefulPopover,
  PLACEMENT as POPOVER_PLACEMENT,
} from 'baseui/popover';
import pick from 'lodash/pick';
import { useParams } from 'next/navigation';
import { MdArrowDropDown } from 'react-icons/md';

import Button from '@/components/button/button';
import { type SchedulePageLayoutParams } from '@/views/schedule-page/schedule-page.types';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import ScheduleActionsMenu from './schedule-actions-menu/schedule-actions-menu';
import ScheduleActionsModal from './schedule-actions-modal/schedule-actions-modal';
import { overrides } from './schedule-actions.styles';
import { type ScheduleAction } from './schedule-actions.types';

export default function ScheduleActions() {
  const params = useParams<SchedulePageLayoutParams>();
  const scheduleDetailsParams = pick(params, 'cluster', 'scheduleId', 'domain');

  const {
    data: schedule,
    isLoading: isScheduleLoading,
    error: scheduleError,
  } = useDescribeSchedule({
    ...scheduleDetailsParams,
  });

  const [selectedAction, setSelectedAction] = useState<
    ScheduleAction<any, any, any> | undefined
  >(undefined);

  if (scheduleError) {
    return null;
  }

  return (
    <>
      <StatefulPopover
        placement={POPOVER_PLACEMENT.bottomRight}
        overrides={overrides.popover}
        content={({ close }) => (
          <ScheduleActionsMenu
            schedule={schedule}
            onActionSelect={(action) => {
              setSelectedAction(action);
              close();
            }}
          />
        )}
        returnFocus
        autoFocus
      >
        <Button
          size="compact"
          kind="secondary"
          endEnhancer={<MdArrowDropDown size={20} />}
          loadingIndicatorType="skeleton"
          isLoading={isScheduleLoading}
        >
          Schedule Actions
        </Button>
      </StatefulPopover>
      <ScheduleActionsModal
        {...scheduleDetailsParams}
        schedule={schedule}
        action={selectedAction}
        onClose={() => setSelectedAction(undefined)}
      />
    </>
  );
}
