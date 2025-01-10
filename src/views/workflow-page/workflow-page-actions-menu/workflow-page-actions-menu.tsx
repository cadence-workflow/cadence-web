import { Button, KIND } from 'baseui/button';

import workflowPageActionsConfig from '../config/workflow-page-actions.config';

import { overrides, styled } from './workflow-page-actions-menu.styles';
import { type Props } from './workflow-page-actions-menu.types';

export default function WorkflowPageActionsMenu({
  workflow,
  onActionSelect,
}: Props) {
  return (
    <styled.MenuItemsContainer>
      {workflowPageActionsConfig.map((action) => (
        <Button
          key={action.id}
          kind={KIND.tertiary}
          overrides={overrides.button}
          onClick={() => onActionSelect(action)}
          disabled={!action.getIsEnabled(workflow)}
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
      ))}
    </styled.MenuItemsContainer>
  );
}
