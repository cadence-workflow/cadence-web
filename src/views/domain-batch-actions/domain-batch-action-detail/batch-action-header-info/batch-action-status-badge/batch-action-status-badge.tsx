'use client';
import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { Tag } from 'baseui/tag';
import { MdCheckCircle, MdOutlineCancel, MdWarning } from 'react-icons/md';

import { BATCH_WORKFLOW_STATUS_LABELS } from './batch-action-status-badge.constants';
import { getTagOverrides } from './batch-action-status-badge.styles';
import { type Props } from './batch-action-status-badge.types';

export default function BatchActionStatusBadge({ status }: Props) {
  const [_, theme] = useStyletron();

  const icon =
    status === 'running' ? (
      <Spinner $size={theme.sizing.scale500} />
    ) : status === 'completed' ? (
      <MdCheckCircle />
    ) : status === 'failed' ? (
      <MdWarning />
    ) : (
      <MdOutlineCancel />
    );

  return (
    <Tag closeable={false} overrides={getTagOverrides(status, theme)}>
      {icon}
      {BATCH_WORKFLOW_STATUS_LABELS[status]}
    </Tag>
  );
}
