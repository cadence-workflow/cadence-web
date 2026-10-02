'use client';
import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { MdCheckCircle, MdOutlineCancel, MdWarning } from 'react-icons/md';

import { type Props } from './status-icon.types';

export default function StatusIcon({ action }: Props) {
  const [_, theme] = useStyletron();
  switch (action.status) {
    case 'COMPLETED':
      return (
        <MdCheckCircle
          size={theme.sizing.scale600}
          color={theme.colors.contentPositive}
        />
      );
    case 'ABORTED':
      return (
        <MdOutlineCancel
          size={theme.sizing.scale600}
          color={theme.colors.contentNegative}
        />
      );
    case 'FAILED':
      return (
        <MdWarning
          size={theme.sizing.scale600}
          color={theme.colors.contentWarning}
        />
      );
    case 'RUNNING':
      return <Spinner $size={theme.sizing.scale600} />;
    default:
      return null;
  }
}
