import React from 'react';
import { render, screen } from '@/test-utils/rtl';
import WorkflowStatusTag from '../workflow-status-tag';

import { type WorkflowStatus } from '../workflow-status-tag.types';

jest.mock('../workflow-status-tag-icon/workflow-status-tag-icon', () =>
  jest.fn(({ kind }) => <div>Mock icon {kind}</div>)
);

describe('WorkflowStatusTag', () => {
  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const tests: Array<{
    name: string;
    workflowStatus: WorkflowStatus;
    text: string;
    link?: string;
  }> = [
      {
        name: 'should render Running correctly',
        workflowStatus: 'WORKFLOW_EXECUTION_STATUS_RUNNING',
        text: 'Running',
      },
      {
        name: 'should render Completed correctly',
        workflowStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
        text: 'Completed',
      },
      {
        name: 'should render Failed correctly',
        workflowStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
        text: 'Failed',
      },
      {
        name: 'should render Timed Out correctly',
        workflowStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
        text: 'Timed Out',
      },
      {
        name: 'should render Canceled correctly',
        workflowStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED',
        text: 'Canceled',
      },
      {
        name: 'should render Terminated correctly',
        workflowStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
        text: 'Terminated',
      },
      {
        name: 'should render Continued As New correctly',
        workflowStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
        text: 'Continued As New',
      },
      {
        name: 'should work with links correctly',
        workflowStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW',
        text: 'Continued As New',
        link: 'mock_continued_workflow_link',
      },
    ];

  tests.forEach((test) => {
    it(test.name, () => {
      render(
        <WorkflowStatusTag status={test.workflowStatus} link={test.link} />
      );

      const tag = screen.getByText(test.text);
      expect(tag).toBeInTheDocument();

      expect(screen.getByText('Mock icon start')).toBeInTheDocument();
      expect(screen.getByText('Mock icon end')).toBeInTheDocument();

      if (test.link) {
        expect(screen.getByRole('button')).toHaveAttribute('href', test.link);
      }
    });
  });
});
