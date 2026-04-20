'use client';
import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { Tag } from 'baseui/tag';
import { MdCheckCircle, MdOutlineCancel, MdWarning } from 'react-icons/md';

import { type BatchActionStatus } from '@/views/domain-batch-actions/domain-batch-actions.types';

import { getTagOverrides } from './batch-action-status-badge.styles';

const STATUS_LABELS: Record<BatchActionStatus, string> = {
  running: 'Processing',
  completed: 'Completed',
  aborted: 'Aborted',
  failed: 'Failed',
};

type Props = {
  status: BatchActionStatus;
};

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
      {STATUS_LABELS[status]}
    </Tag>
  );
}
