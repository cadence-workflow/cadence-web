import Button from '@/components/button/button';

import { overrides, styled } from './domain-batch-actions-banner.styles';
import { type Props } from './domain-batch-actions-banner.types';

export default function DomainBatchActionsBanner({
  icon,
  children,
  actionLabel,
  onActionClick,
}: Props) {
  return (
    <styled.Banner>
      <styled.Content>
        <styled.IconContainer>{icon}</styled.IconContainer>
        {children}
      </styled.Content>
      {actionLabel && onActionClick && (
        <Button
          kind="secondary"
          size="compact"
          shape="pill"
          overrides={overrides.bannerButton}
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      )}
    </styled.Banner>
  );
}
