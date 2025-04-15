import { type ReactNode } from 'react';

import { type IconProps } from 'baseui/icon';
import {
  type Control,
  type FieldErrors,
  type FieldValues,
} from 'react-hook-form';
import { type z } from 'zod';

import { type WorkflowActionID as WorkflowActionIDFromConfig } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';
import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

import type WORKFLOW_ACTIONS_NON_RUNNABLE_STATUSES_CONFIG from './config/workflow-actions-non-runnable-statuses.config';

// TODO: move this to a shared types folder
export type WorkflowActionID = WorkflowActionIDFromConfig;

export type WorkflowActionInputParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type WorkflowActionInput<SubmissionData> = WorkflowActionInputParams & {
  submissionData: SubmissionData;
};

export type WorkflowActionFormProps<FormData extends FieldValues> = {
  formData: FormData;
  fieldErrors: FieldErrors<FormData>;
  control: Control<FormData>;
};

export type WorkflowActionSuccessMessageProps<SubmissionData, Result> = {
  result: Result;
  inputParams: WorkflowActionInput<SubmissionData>;
  onDismissMessage: () => void;
};

export type WorkflowActionNonRunnableStatus =
  (typeof WORKFLOW_ACTIONS_NON_RUNNABLE_STATUSES_CONFIG)[number];

export type WorkflowActionRunnableStatus =
  | 'RUNNABLE'
  | WorkflowActionNonRunnableStatus;

export type WorkflowActionModalForm<FormData, SubmissionData> =
  FormData extends FieldValues
    ? {
        form: (props: WorkflowActionFormProps<FormData>) => ReactNode;
        formSchema: z.ZodSchema<FormData>;
        transformFormDataToSubmission: (formData: FormData) => SubmissionData;
      }
    : {
        form?: undefined;
        formSchema?: undefined;
        transformFormDataToSubmission?: undefined;
      };

export type WorkflowAction<FormData, SubmissionData, Result> = {
  id: WorkflowActionID;
  label: string;
  subtitle: string;
  modal: {
    text: string | string[];
    docsLink?: {
      text: string;
      href: string;
    };
  } & WorkflowActionModalForm<FormData, SubmissionData>;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
  getRunnableStatus: (
    workflow: DescribeWorkflowResponse
  ) => WorkflowActionRunnableStatus;
  apiRoute: string;
  renderSuccessMessage: (
    props: WorkflowActionSuccessMessageProps<SubmissionData, Result>
  ) => ReactNode;
};
