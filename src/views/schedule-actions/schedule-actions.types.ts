import { type ReactNode } from 'react';

import { type QueryClient } from '@tanstack/react-query';
import { type KIND as BANNER_KIND } from 'baseui/banner';
import { type IconProps } from 'baseui/icon';
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {
  type DefaultValues,
  type UseFormClearErrors,
  type Control,
  type FieldErrors,
  type FieldValues,
  type UseFormTrigger,
} from 'react-hook-form';
import { type z } from 'zod';

import { type ScheduleActionID } from '@/config/dynamic/resolvers/schedule-actions-enabled.types';
import { type FormattedScheduleDetails } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

import type SCHEDULE_ACTIONS_NON_RUNNABLE_STATUSES_CONFIG from './config/schedule-actions-non-runnable-statuses.config';

export type ScheduleActionInputParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type PauseScheduleSubmissionData = {
  reason: string;
};

export type { BackfillScheduleSubmissionData } from '@/route-handlers/backfill-schedule/backfill-schedule.types';

export type ScheduleActionInput<SubmissionData> = ScheduleActionInputParams & {
  submissionData: SubmissionData;
};

export type ScheduleActionFormProps<FormData extends FieldValues> = {
  fieldErrors: FieldErrors<FormData>;
  control: Control<FormData>;
  clearErrors: UseFormClearErrors<FormData>;
  trigger: UseFormTrigger<FormData>;
  cluster: string;
  domain: string;
  scheduleId: string;
  schedule?: FormattedScheduleDetails;
  isSubmitted?: boolean;
};

export type ScheduleActionSuccessMessageProps<SubmissionData, Result> = {
  result: Result;
  inputParams: ScheduleActionInput<SubmissionData>;
  onDismissMessage: () => void;
};

export type ScheduleActionNonRunnableStatus =
  (typeof SCHEDULE_ACTIONS_NON_RUNNABLE_STATUSES_CONFIG)[number];

export type ScheduleActionRunnableStatus =
  | 'RUNNABLE'
  | ScheduleActionNonRunnableStatus;

export type ScheduleActionBannerKind = keyof typeof BANNER_KIND;

export type ScheduleActionIcon = (props: {
  size?: IconProps['size'];
  color?: IconProps['color'];
}) => ReactNode;

export type ScheduleActionModalBanner = {
  kind: ScheduleActionBannerKind;
  icon: ScheduleActionIcon;
  render: (schedule?: FormattedScheduleDetails) => ReactNode;
};

export type ScheduleActionModalForm<FormData, SubmissionData> =
  | {
      withForm: true;
      form: (
        props: ScheduleActionFormProps<
          FormData extends FieldValues ? FormData : FieldValues
        >
      ) => ReactNode;
      formSchema: z.ZodSchema<FormData>;
      transformFormDataToSubmission: (formData: FormData) => SubmissionData;
      initialFormValues?: DefaultValues<
        FormData extends FieldValues ? FormData : FieldValues
      >;
    }
  | {
      withForm: false;
      form?: undefined;
      formSchema?: undefined;
      transformFormDataToSubmission?: undefined;
    };

export type ScheduleActionHttpMethod = 'POST' | 'PUT' | 'DELETE';

export type ScheduleAction<
  Result,
  FormData = undefined,
  SubmissionData = undefined,
> = {
  id: ScheduleActionID;
  label: string;
  subtitle: string;
  modal: {
    banner?: ScheduleActionModalBanner;
  } & ScheduleActionModalForm<FormData, SubmissionData>;
  icon: ScheduleActionIcon;
  getRunnableStatus: (
    schedule: FormattedScheduleDetails
  ) => ScheduleActionRunnableStatus;
  apiRoute: (params: ScheduleActionInputParams) => string;
  httpMethod?: ScheduleActionHttpMethod;
  getConfirmSubmissionData?: () => SubmissionData;
  renderSuccessMessage: (
    props: ScheduleActionSuccessMessageProps<SubmissionData, Result>
  ) => ReactNode;
  onSuccess?: (props: {
    queryClient: QueryClient;
    params: ScheduleActionInputParams;
    router: AppRouterInstance;
  }) => void;
};

/** Erases per-action generics for the generic modal boundary. */
export type ErasedScheduleAction = ScheduleAction<any, any, any>;
