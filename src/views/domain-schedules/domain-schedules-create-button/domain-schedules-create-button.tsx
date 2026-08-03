'use client';

import React from 'react';

import { StatefulTooltip } from 'baseui/tooltip';
import { MdAdd } from 'react-icons/md';

import Button from '@/components/button/button';
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import getActionDisabledReason from '@/views/schedule-actions/schedule-actions-menu/helpers/get-action-disabled-reason';

import { type Props } from './domain-schedules-create-button.types';

export default function DomainSchedulesCreateButton({
  domain,
  cluster,
  onClick,
  kind = 'primary',
  size = 'compact',
  shape = 'default',
  overrides,
}: Props) {
  const {
    data: actionsEnabledConfig,
    isLoading: isActionsEnabledLoading,
    isError: isActionsEnabledError,
  } = useConfigValue('SCHEDULE_ACTIONS_ENABLED', {
    domain,
    cluster,
  });

  const disabledReason = getActionDisabledReason({
    actionEnabledConfig: actionsEnabledConfig?.start,
    actionRunnableStatus: 'RUNNABLE',
  });

  return (
    <StatefulTooltip
      content={disabledReason ?? null}
      ignoreBoundary
      placement="auto"
      showArrow
    >
      <div>
        <Button
          kind={kind}
          size={size}
          shape={shape}
          startEnhancer={<MdAdd size={16} aria-hidden />}
          onClick={onClick}
          loadingIndicatorType="skeleton"
          isLoading={isActionsEnabledLoading || isActionsEnabledError}
          disabled={Boolean(disabledReason)}
          aria-label={disabledReason ?? undefined}
          overrides={overrides}
        >
          Create schedule
        </Button>
      </div>
    </StatefulTooltip>
  );
}
