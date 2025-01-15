import { Button, KIND } from 'baseui/button';

import workflowActionsConfig from '../config/workflow-actions.config';

import { overrides, styled } from './workflow-actions-menu.styles';
import { type Props } from './workflow-actions-menu.types';

export default function WorkflowActionsMenu({
  workflow,
  onActionSelect,
}: Props) {
  return (
    <styled.MenuItemsContainer>
      {workflowActionsConfig.map((action) => (
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
