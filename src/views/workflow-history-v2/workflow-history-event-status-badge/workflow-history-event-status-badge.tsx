import { Badge } from 'baseui/badge';
import { Skeleton } from 'baseui/skeleton';

import workflowHistoryEventStatusBadgesConfig from '../config/workflow-history-event-status-badges.config';

import {
  overrides,
  styled,
} from './workflow-history-event-status-badge.styles';
import { type Props } from './workflow-history-event-status-badge.types';

export default function WorkflowHistoryEventStatusBadge({
  status,
  statusText,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <Skeleton
        height="20px"
        width="80px"
        overrides={overrides.badgeSkeleton}
        animation
      />
    );
  }

  const {
    icon: Icon,
    hierarchy,
    color,
  } = workflowHistoryEventStatusBadgesConfig[status];

  // TODO @adhitya.mamallan - once we update Baseweb to 16, use the new Tag here
  return (
    <Badge
      hierarchy={hierarchy}
      color={color}
      overrides={overrides.badge}
      content={
        <styled.BadgeContentContainer>
          <Icon size={14} />
          {statusText}
        </styled.BadgeContentContainer>
      }
    />
  );
}
