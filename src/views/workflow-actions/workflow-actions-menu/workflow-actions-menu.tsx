import { Button, KIND } from 'baseui/button';
import { StatefulTooltip, PLACEMENT } from 'baseui/tooltip';

import workflowActionsConfig from '../config/workflow-actions.config';

import getActionDisabledReason from './helpers/get-action-disabled-reason';
import { overrides, styled } from './workflow-actions-menu.styles';
import { type Props } from './workflow-actions-menu.types';

export default function WorkflowActionsMenu({
  workflow,
  actionsEnabledConfig,
  onActionSelect,
}: Props) {
  return (
    <styled.MenuItemsContainer>
      {workflowActionsConfig.map((action) => {
        const actionDisabledReason = getActionDisabledReason({
          actionEnabledConfig: actionsEnabledConfig?.[action.id],
          actionRunnableStatus: action.getRunnableStatus(workflow),
        });

        return (
          <StatefulTooltip
            key={action.id}
            content={actionDisabledReason ?? null}
            ignoreBoundary
            placement={PLACEMENT.auto}
            showArrow
          >
            {/* The Baseweb button needs a wrapper div so that it works with tooltips */}
            <div>
              <Button
                kind={KIND.tertiary}
                overrides={overrides.button}
                onClick={() => onActionSelect(action)}
                {...(actionDisabledReason
                  ? {
                      disabled: true,
                      'aria-label': actionDisabledReason,
                    }
                  : {
                      disabled: false,
                    })}
              >
                <styled.MenuItemContainer>
                  <action.icon />
                  <styled.MenuItemLabel>
                    {action.label}
                    <styled.MenuItemSubtitle>
                      {action.subtitle}
                    </styled.MenuItemSubtitle>
                  </styled.MenuItemLabel>
                </styled.MenuItemContainer>
              </Button>
            </div>
          </StatefulTooltip>
        );
      })}
    </styled.MenuItemsContainer>
  );
}
