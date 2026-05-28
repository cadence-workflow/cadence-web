import { type ReactNode } from 'react';

import {
  type Control,
  type FieldErrors,
  type FieldValues,
} from 'react-hook-form';
import { type z } from 'zod';

import { type BatchActionStatus } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

export type BatchActionType = 'cancel' | 'terminate' | 'reset' | 'signal';

export type BatchActionConfirmableType = Extract<
  BatchActionType,
  'cancel' | 'terminate' | 'signal'
>;

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

type BatchActionModalForm<FormData, SubmissionData> =
  | {
      withForm: true;
      form: (
        props: BatchActionFormProps<
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

export type BatchActionModalConfig<
  FormData = undefined,
  SubmissionData = undefined,
> = BatchActionModalBase & BatchActionModalForm<FormData, SubmissionData>;

export type BatchAction = {
  id: string;
  status: BatchActionStatus;
  progress?: number; // 0-100, only relevant when status is 'RUNNING'
  actionType: BatchActionType;
  startTime?: number;
  endTime?: number;
  rps?: number;
  concurrency?: number;
};
