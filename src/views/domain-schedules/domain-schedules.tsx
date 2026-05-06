'use client';

import React from 'react';

import { MdAdd } from 'react-icons/md';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';

import { styled } from './domain-schedules.styles';
import { type Props } from './domain-schedules.types';

export default function DomainSchedules(_props: Props) {
  return (
    <styled.Root>
      <styled.Toolbar>
        <styled.ToolbarTitle>{`Schedules (0)`}</styled.ToolbarTitle>
      </styled.Toolbar>

      <PanelSection>
        <ErrorPanel
          message="No schedules found"
          description="No schedules have been defined for this domain. Click the button below to create a schedule and start automating your executions."
          omitLogging={true}
          actions={[
            {
              kind: 'callback',
              label: 'Create schedule',
              onClick: () => {},
              buttonKind: 'primary',
              shape: 'default',
              startEnhancer: <MdAdd size={18} aria-hidden />,
            },
          ]}
        />
      </PanelSection>
    </styled.Root>
  );
}
