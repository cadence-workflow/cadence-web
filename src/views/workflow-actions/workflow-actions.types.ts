import { type ReactNode } from 'react';

import { type IconProps } from 'baseui/icon';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

import { type WORKFLOW_ACTION_RUN_STATUS_VALUES } from './workflow-actions.constants';

export type WorkflowActionInputParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  // TODO: add input here for extended workflow actions
};

export type WorkflowActionID = 'cancel' | 'terminate' | 'restart';

export type WorkflowActionSuccessMessageProps<R> = {
  result: R;
  inputParams: WorkflowActionInputParams;
};

export type WorkflowActionRunStatus =
  (typeof WORKFLOW_ACTION_RUN_STATUS_VALUES)[number];

export type WorkflowAction<R> = {
  id: WorkflowActionID;
  label: string;
  subtitle: string;
  modal: {
    text: string | string[];
    docsLink?: {
      text: string;
      href: string;
    };
  };
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
  getRunStatus: (workflow: DescribeWorkflowResponse) => WorkflowActionRunStatus;
  apiRoute: string;
  renderSuccessMessage: (
    props: WorkflowActionSuccessMessageProps<R>
  ) => ReactNode;
};
