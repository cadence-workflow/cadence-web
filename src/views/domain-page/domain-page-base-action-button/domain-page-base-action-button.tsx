import { StatefulTooltip } from 'baseui/tooltip';

import Button from '@/components/button/button';

import { overrides } from './domain-page-base-action-button.styles';
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
          size="compact"
          overrides={overrides.button}
          onClick={onClick}
          disabled={Boolean(disabledReason)}
          aria-label={disabledReason ?? undefined}
          startEnhancer={() => <Icon size={20} />}
        >
          {label}
        </Button>
      </div>
    </StatefulTooltip>
  );
}
