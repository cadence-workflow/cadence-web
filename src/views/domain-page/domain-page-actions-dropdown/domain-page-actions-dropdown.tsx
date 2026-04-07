'use client';
import React, { useMemo, useState } from 'react';

import { Button, KIND } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import { StatefulTooltip } from 'baseui/tooltip';
import { MdArrowDropDown } from 'react-icons/md';

import CustomButton from '@/components/button/button';
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import { startWorkflowActionConfig } from '@/views/workflow-actions/config/workflow-actions.config';
import getActionDisabledReason from '@/views/workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason';
import WorkflowActionsModal from '@/views/workflow-actions/workflow-actions-modal/workflow-actions-modal';

import domainPageActionsConfig, {
  batchWorkflowDomainAction,
  startWorkflowDomainAction,
} from '../config/domain-page-actions.config';

import { styled, overrides } from './domain-page-actions-dropdown.styles';
import type {
  DomainPageActionConfig,
  Props,
} from './domain-page-actions-dropdown.types';

export default function DomainPageActionsDropdown({
  domain,
  cluster,
  isBatchActionsEnabled,
}: Props) {
  const [showStartNewWorkflowModal, setShowStartNewWorkflowModal] =
    useState(false);

  const {
    data: actionsEnabledConfig,
    isLoading: isActionsEnabledLoading,
    isError: isActionsEnabledError,
  } = useConfigValue('WORKFLOW_ACTIONS_ENABLED', {
    domain,
    cluster,
  });

  const startDisabledReason = getActionDisabledReason({
    actionEnabledConfig: actionsEnabledConfig?.start,
    actionRunnableStatus: 'RUNNABLE',
  });

  const visibleActions = useMemo(() => {
    return domainPageActionsConfig.filter((action) => {
      if (action.id === batchWorkflowDomainAction.id) {
        return isBatchActionsEnabled;
      }
      return true;
    });
  }, [isBatchActionsEnabled]);

  const getDisabledReason = (action: DomainPageActionConfig) => {
    if (action.id === startWorkflowDomainAction.id) {
      return startDisabledReason;
    }
    return null;
  };

  const handleActionClick = (action: DomainPageActionConfig) => {
    if (action.id === startWorkflowDomainAction.id) {
      setShowStartNewWorkflowModal(true);
    }
  };

  return (
    <>
      <StatefulPopover
        placement="bottomLeft"
        overrides={overrides.popover}
        content={({ close }) => (
          <styled.MenuItemsContainer>
            {visibleActions.map((action) => {
              const disabledReason = getDisabledReason(action);
              return (
                <StatefulTooltip
                  key={action.id}
                  content={disabledReason ?? null}
                  ignoreBoundary
                  placement="auto"
                  showArrow
                >
                  <div>
                    <Button
                      kind={KIND.tertiary}
                      overrides={overrides.button}
                      onClick={() => {
                        handleActionClick(action);
                        close();
                      }}
                      disabled={Boolean(disabledReason)}
                      aria-label={disabledReason ?? undefined}
                    >
                      <styled.MenuItemContainer>
                        <action.icon size={20} />
                        <styled.MenuItemLabel>
                          {action.label}
                        </styled.MenuItemLabel>
                      </styled.MenuItemContainer>
                    </Button>
                  </div>
                </StatefulTooltip>
              );
            })}
          </styled.MenuItemsContainer>
        )}
        returnFocus
        autoFocus
      >
        <CustomButton
          size="compact"
          kind="secondary"
          endEnhancer={<MdArrowDropDown size={16} />}
          loadingIndicatorType="skeleton"
          isLoading={isActionsEnabledLoading || isActionsEnabledError}
        >
          Domain actions
        </CustomButton>
      </StatefulPopover>
      {showStartNewWorkflowModal && (
        <WorkflowActionsModal
          domain={domain}
          cluster={cluster}
          runId=""
          workflowId=""
          action={startWorkflowActionConfig}
          onClose={() => {
            setShowStartNewWorkflowModal(false);
          }}
        />
      )}
    </>
  );
}
