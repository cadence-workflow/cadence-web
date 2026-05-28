import { StatefulTooltip } from 'baseui/tooltip';

import Button from '@/components/button/button';

import { styled, overrides } from './domain-page-base-action-button.styles';
import { type Props } from './domain-page-base-action-button.types';

export default function DomainPageBaseActionButton({
  label,
  icon: Icon,
  onClick,
  disabledReason,
}: Props) {
  return (
    <StatefulTooltip
      content={disabledReason ?? null}
      ignoreBoundary
      placement="auto"
      showArrow
    >
      <div>
        <Button
          kind="tertiary"
          overrides={overrides.button}
          onClick={onClick}
          disabled={Boolean(disabledReason)}
          aria-label={disabledReason ?? undefined}
        >
          <styled.MenuItemContainer>
            <Icon size={20} />
            <styled.MenuItemLabel>{label}</styled.MenuItemLabel>
          </styled.MenuItemContainer>
        </Button>
      </div>
    </StatefulTooltip>
  );
}
