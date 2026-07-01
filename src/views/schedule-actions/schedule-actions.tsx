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
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import { type SchedulePageLayoutParams } from '@/views/schedule-page/schedule-page.types';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import { type SelectableScheduleAction } from './config/schedule-actions.config';
import ScheduleActionsMenu from './schedule-actions-menu/schedule-actions-menu';
import ScheduleActionsModal from './schedule-actions-modal/schedule-actions-modal';
import { overrides } from './schedule-actions.styles';
import { type ErasedScheduleAction } from './schedule-actions.types';

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

  const { data: actionsEnabledConfig, isLoading: isActionsEnabledLoading } =
    useConfigValue('SCHEDULE_ACTIONS_ENABLED', {
      domain: params.domain,
      cluster: params.cluster,
    });

  const [selectedAction, setSelectedAction] = useState<
    SelectableScheduleAction | undefined
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
            actionsEnabledConfig={actionsEnabledConfig}
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
          isLoading={isScheduleLoading || isActionsEnabledLoading}
        >
          Schedule Actions
        </Button>
      </StatefulPopover>
      <ScheduleActionsModal
        {...scheduleDetailsParams}
        schedule={schedule}
        action={selectedAction as ErasedScheduleAction | undefined}
        onClose={() => setSelectedAction(undefined)}
      />
    </>
  );
}
