import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';
import {
  MdCheck,
  MdClose,
  MdHourglassTop,
  MdReportGmailerrorred,
} from 'react-icons/md';

import getBadgeIconSize from './helpers/get-badge-icon-size';
import {
  WORKFLOW_EVENT_STATUS,
  WORKFLOW_EVENT_STATUS_BADGE_SIZES,
} from './workflow-history-event-status-badge.constants';
import { styled } from './workflow-history-event-status-badge.styles';
import type { Props } from './workflow-history-event-status-badge.types';

export default function WorkflowHistoryEventStatusBadge({
  status,
  size = WORKFLOW_EVENT_STATUS_BADGE_SIZES.medium,
}: Props) {
  const [_, theme] = useStyletron();
  if (!WORKFLOW_EVENT_STATUS[status]) return null;

  const renderIcon = () => {
    const iconSize = getBadgeIconSize(theme, size);

    if (iconSize === undefined) return null;

    switch (status) {
      case WORKFLOW_EVENT_STATUS.COMPLETED:
        return <MdCheck size={iconSize} />;
      case WORKFLOW_EVENT_STATUS.FAILED:
        return <MdReportGmailerrorred size={iconSize} />;
      case WORKFLOW_EVENT_STATUS.CANCELED:
        return <MdClose size={iconSize} />;
      case WORKFLOW_EVENT_STATUS.ONGOING:
        return <Spinner $size={iconSize} />;
      case WORKFLOW_EVENT_STATUS.WAITING:
        return <MdHourglassTop size={iconSize} />;
    }
  };

  return (
    <styled.BadgeContainer $size={size} $status={status}>
      {renderIcon()}
    </styled.BadgeContainer>
  );
}
