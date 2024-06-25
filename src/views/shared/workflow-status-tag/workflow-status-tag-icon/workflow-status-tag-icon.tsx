import React from 'react';

import { WORKFLOW_STATUSES } from '../workflow-status-tag.constants';

import { styled } from './workflow-status-tag-icon.styles';
import { type Props } from './workflow-status-tag-icon.types';

export default function WorkflowStatusTagIcon(props: Props) {
  switch (props.kind) {
    case 'start':
      if (props.status === WORKFLOW_STATUSES.running) {
        return <styled.Spinner aria-label="running-spinner" />;
      }
    case 'end':
    // if there is a link, return the styled link
  }
  return null;
}
