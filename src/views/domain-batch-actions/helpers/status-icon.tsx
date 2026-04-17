'use client';
import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { MdCheckCircle, MdOutlineCancel, MdWarning } from 'react-icons/md';

import { type BatchAction } from '../domain-batch-actions.types';

export default function StatusIcon({ action }: { action: BatchAction }) {
  const [_, theme] = useStyletron();
  switch (action.status) {
    case 'completed':
      return (
        <MdCheckCircle
          size={theme.sizing.scale600}
          color={theme.colors.contentPositive}
        />
      );
    case 'aborted':
      return (
        <MdOutlineCancel
          size={theme.sizing.scale600}
          color={theme.colors.contentNegative}
        />
      );
    case 'failed':
      return (
        <MdWarning
          size={theme.sizing.scale600}
          color={theme.colors.contentWarning}
        />
      );
    case 'running':
      return <Spinner $size={theme.sizing.scale600} />;
    default:
      return null;
  }
}
