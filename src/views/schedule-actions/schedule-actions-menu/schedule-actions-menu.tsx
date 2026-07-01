import { Button, KIND } from 'baseui/button';
import { StatefulTooltip, PLACEMENT } from 'baseui/tooltip';

import scheduleActionsConfig from '../config/schedule-actions.config';

import getActionDisabledReason from './helpers/get-action-disabled-reason';
import { overrides, styled } from './schedule-actions-menu.styles';
import { type Props } from './schedule-actions-menu.types';

export default function ScheduleActionsMenu({
  schedule,
  actionsEnabledConfig,
  onActionSelect,
}: Props) {
  return (
    <styled.MenuItemsContainer>
      {scheduleActionsConfig.map((action) => {
        const actionDisabledReason = getActionDisabledReason({
          actionEnabledConfig: actionsEnabledConfig?.[action.id],
          actionRunnableStatus: schedule
            ? action.getRunnableStatus(schedule)
            : undefined,
        });

        return (
          <StatefulTooltip
            key={action.id}
            content={actionDisabledReason ?? null}
            ignoreBoundary
            placement={PLACEMENT.auto}
            showArrow
          >
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
