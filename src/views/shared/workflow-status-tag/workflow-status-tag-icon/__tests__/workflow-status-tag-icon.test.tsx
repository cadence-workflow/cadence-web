import React from 'react';
import { render, screen } from '@/test-utils/rtl';

import WorkflowStatusTagIcon from '../workflow-status-tag-icon';
import { WorkflowStatusTagIconKind } from '../workflow-status-tag-icon.types';
import { WorkflowStatus } from '../../workflow-status-tag.types';

describe('WorkflowStatusTagIcon', () => {
  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const tests: Array<{
    name: string;
    kind: WorkflowStatusTagIconKind;
    status: WorkflowStatus;
    link?: string;
    expectedIcon?: string;
  }> = [
      {
        name: 'should render Running start icon correctly',
        kind: 'start',
        status: 'WORKFLOW_EXECUTION_STATUS_RUNNING',
        expectedIcon: 'running-spinner',
      },
      {
        name: 'should return null if there is no icon configured',
        kind: 'end',
        status: 'WORKFLOW_EXECUTION_STATUS_RUNNING',
      },
    ];

  tests.forEach((test) => {
    it(test.name, () => {
      render(
        <WorkflowStatusTagIcon
          kind={test.kind}
          status={test.status}
          link={test.link}
        />
      );

      if (test.expectedIcon) {
        expect(
          screen.getByLabelText(`${test.expectedIcon}`)
        ).toBeInTheDocument();
      }
    });
  });
});
