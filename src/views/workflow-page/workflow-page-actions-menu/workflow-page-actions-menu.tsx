import { Button, KIND } from 'baseui/button';

import workflowPageActionsConfig from '../config/workflow-page-actions.config';

import { overrides, styled } from './workflow-page-actions-menu.styles';
import { type Props } from './workflow-page-actions-menu.types';

export default function WorkflowPageActionsMenu({
  workflow,
  isLoading,
  disableAll,
  onMenuItemSelect,
}: Props) {
  return (
    <styled.MenuItemsContainer>
      {workflowPageActionsConfig.map((action) => (
        <Button
          key={action.id}
          kind={KIND.tertiary}
          overrides={overrides.button}
          onClick={() => onMenuItemSelect(action)}
          isLoading={isLoading}
          disabled={disableAll ? true : !action.getIsEnabled(workflow)}
        >
          <styled.MenuItemContainer>
            <action.icon />
            <styled.MenuItemLabel>
              {action.label}
              <styled.MenuItemDescription>
                {action.description}
              </styled.MenuItemDescription>
            </styled.MenuItemLabel>
          </styled.MenuItemContainer>
        </Button>
      ))}
    </styled.MenuItemsContainer>
  );
}
