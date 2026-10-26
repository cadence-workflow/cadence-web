'use client';
import React from 'react';

import CopyTextButton from '@/components/copy-text-button/copy-text-button';
import ErrorPanel from '@/components/error-panel/error-panel';

import {
  WORKFLOW_HOME_EMPTY_DESCRIPTION,
  WORKFLOW_HOME_GO_SNIPPET,
  WORKFLOW_HOME_MESSAGES,
} from '../workflow-home.constants';

import { styled } from './workflow-home-empty.styles';

export default function WorkflowHomeEmpty() {
  return (
    <ErrorPanel
      omitLogging
      message={WORKFLOW_HOME_MESSAGES.empty}
      description={
        <styled.Description>
          <span>{WORKFLOW_HOME_EMPTY_DESCRIPTION}</span>
          <styled.Snippet>
            <styled.Code>{WORKFLOW_HOME_GO_SNIPPET}</styled.Code>
            <styled.CopyButtonContainer>
              <CopyTextButton textToCopy={WORKFLOW_HOME_GO_SNIPPET} />
            </styled.CopyButtonContainer>
          </styled.Snippet>
        </styled.Description>
      }
      actions={[
        {
          kind: 'link-internal',
          label: 'Markdoc guide',
          link: '/docs',
          buttonKind: 'secondary',
        },
      ]}
    />
  );
}
