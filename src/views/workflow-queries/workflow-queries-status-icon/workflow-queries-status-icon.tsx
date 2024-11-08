import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { MdCheckCircle, MdWarning } from 'react-icons/md';

import { type Props } from './workflow-queries-status-icon.types';

export default function WorkflowQueriesStatusIcon({ status }: Props) {
  const [_, theme] = useStyletron();
  switch (status) {
    case 'error':
      return (
        <MdWarning
          size={theme.sizing.scale600}
          color={theme.colors.backgroundNegative}
        />
      );
    case 'loading':
      return <Spinner $size={theme.sizing.scale600} />;
    case 'success':
      return (
        <MdCheckCircle
          size={theme.sizing.scale600}
          color={theme.colors.backgroundPositive}
        />
      );
    default:
      return null;
  }
}
