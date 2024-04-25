import React from 'react';

import { styled } from './workflow-status-tag-icon.styles';
import { Props } from './workflow-status-tag-icon.types';

export default function WorkflowStatusTagIcon(props: Props) {
  switch (props.kind) {
    case 'start':
      if (props.status === 'running') {
        return <styled.Spinner data-testid="running-spinner" />;
      }
    case 'end':
    // if there is a link, return the styled link
  }
  return null;
}
