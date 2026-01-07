import { Button } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import Link from 'next/link';
import { MdOutlineInfo } from 'react-icons/md';

import {
  overrides,
  styled,
} from './workflow-history-view-toggle-button.styles';
import { type Props } from './workflow-history-view-toggle-button.types';

export default function WorkflowHistoryViewToggleButton({
  kind,
  label,
  onClick,
  tooltipContent,
}: Props) {
  const { content, linkButtons } = tooltipContent;

  return (
    <StatefulPopover
      content={() => (
        <styled.TooltipContentContainer>
          {content.map((paragraph, index) => (
            <styled.TooltipText key={`tooltip_paragraph_${index}`}>
              {paragraph}
            </styled.TooltipText>
          ))}
          {linkButtons && linkButtons.length > 0 && (
            <styled.TooltipLinkButtons>
              {linkButtons.map(({ label, href, startEnhancer }) => (
                <Button
                  key={label}
                  size="mini"
                  kind="secondary"
                  $as={Link}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  startEnhancer={startEnhancer}
                >
                  {label}
                </Button>
              ))}
            </styled.TooltipLinkButtons>
          )}
        </styled.TooltipContentContainer>
      )}
      placement="auto"
      accessibilityType="tooltip"
      triggerType="hover"
      showArrow
      popoverMargin={4}
      overrides={overrides.popover}
    >
      <div>
        <Button
          size="compact"
          onClick={onClick}
          overrides={
            kind === 'primary'
              ? overrides.buttonPrimary
              : overrides.buttonSecondary
          }
          endEnhancer={<MdOutlineInfo size={16} />}
        >
          {label}
        </Button>
      </div>
    </StatefulPopover>
  );
}
