import { type ReactNode } from 'react';

import {
  type Control,
  type FieldErrors,
  type FieldValues,
} from 'react-hook-form';
import { type z } from 'zod';

import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

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

// Mirrors the batcher's HeartBeatDetails progress counts. `completed` is
// `successCount + errorCount` and `totalEstimate` is the estimated workflow count.
export type BatchActionProgress = {
  totalEstimate: number;
  successCount: number;
  errorCount: number;
};

export type BatchAction = {
  id: string;
  status: BatchActionStatus;
  // Present while RUNNING (live activity heartbeat) and when COMPLETED (final
  // workflow result). Absent for aborted/failed actions or before counts exist.
  progress?: BatchActionProgress;
  // Set when progress could not be loaded; the UI shows a non-fatal banner.
  progressError?: boolean;
  actionType?: BatchActionType; // absent if BatchType is missing from the batcher input
  startTime?: number;
  endTime?: number;
  rps?: number;
};

export type BatchActionConfirmPayload<SubmissionData> = {
  actionId: BatchActionType;
  submissionData: SubmissionData;
};
