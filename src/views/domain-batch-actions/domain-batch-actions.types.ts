import { type ReactNode } from 'react';

import {
  type Control,
  type FieldErrors,
  type FieldValues,
} from 'react-hook-form';
import { type z } from 'zod';

import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';
import {
  type SignalWorkflowFormData,
  type SignalWorkflowSubmissionData,
} from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

export type BatchActionFormProps<FormData extends FieldValues> = {
  control: Control<FormData>;
  fieldErrors: FieldErrors<FormData>;
};

type BatchActionModalBase = {
  title: string;
  description: string;
  docsLink?: {
    text: string;
    href: string;
  };
};

type BatchActionModalFormVariant<FormData, SubmissionData> = {
  withForm: true;
  form: (
    props: BatchActionFormProps<FormData extends FieldValues ? FormData : any>
  ) => ReactNode;
  formSchema: z.ZodSchema<FormData>;
  transformFormDataToSubmission: (formData: FormData) => SubmissionData;
};

type BatchActionModalNoFormVariant = {
  withForm: false;
  form?: undefined;
  formSchema?: undefined;
  transformFormDataToSubmission?: undefined;
};

export type BatchActionModalConfigWithForm<FormData, SubmissionData> =
  BatchActionModalBase & BatchActionModalFormVariant<FormData, SubmissionData>;

export type BatchActionModalConfigNoForm = BatchActionModalBase &
  BatchActionModalNoFormVariant;

// The generic union — used by the component for the entry it looks up by actionId.
export type BatchActionModalConfig<
  FormData = undefined,
  SubmissionData = undefined,
> = BatchActionModalBase &
  (
    | BatchActionModalFormVariant<FormData, SubmissionData>
    | BatchActionModalNoFormVariant
  );

export type BatchAction = {
  id: string;
  status: BatchActionStatus;
  progress?: number; // 0-100, only relevant when status is 'RUNNING'
  actionType?: BatchActionType; // absent if BatchType is not UI-supported
  startTime?: number;
  endTime?: number;
  rps?: number;
  concurrency?: number;
};

// Source of truth for the confirmation modal config. The config object must
// comply with this type. `Partial` lets the config omit any action
// and prevent adding an unsupported one.
export type BatchActionsConfirmationModalConfig = Partial<{
  cancel: BatchActionModalConfigNoForm;
  terminate: BatchActionModalConfigNoForm;
  signal: BatchActionModalConfigWithForm<
    SignalWorkflowFormData,
    SignalWorkflowSubmissionData
  >;
}>;

export type BatchActionConfirmPayload = {
  [K in keyof BatchActionsConfirmationModalConfig]-?: NonNullable<
    BatchActionsConfirmationModalConfig[K]
  > extends BatchActionModalConfigWithForm<any, infer S>
    ? { actionId: K; submissionData: S }
    : { actionId: K };
}[keyof BatchActionsConfirmationModalConfig];
