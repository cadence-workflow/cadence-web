import { type ReactNode } from 'react';

import { type IconProps } from 'baseui/icon';
import {
  type UseFormClearErrors,
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
  clearErrors: UseFormClearErrors<FormData>;
  cluster: string;
  domain: string;
  workflowId: string;
  runId: string;
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
  | {
      withForm: true;
      form: (
        props: WorkflowActionFormProps<
          FormData extends FieldValues ? FormData : any
        >
      ) => ReactNode;
      formSchema: z.ZodSchema<FormData>;
      transformFormDataToSubmission: (formData: FormData) => SubmissionData;
    }
  | {
      withForm: false;
      form?: undefined;
      formSchema?: undefined;
      transformFormDataToSubmission?: undefined;
    };

export type WorkflowAction<
  Result,
  FormData = undefined,
  SubmissionData = undefined,
> = {
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
  apiRoute: (params: WorkflowActionInputParams) => string;
  renderSuccessMessage: (
    props: WorkflowActionSuccessMessageProps<SubmissionData, Result>
  ) => ReactNode;
};
