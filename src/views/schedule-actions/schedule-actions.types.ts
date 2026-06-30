import { type ReactNode } from 'react';

import { type QueryClient } from '@tanstack/react-query';
import { type KIND as BANNER_KIND } from 'baseui/banner';
import { type IconProps } from 'baseui/icon';
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {
  type UseFormClearErrors,
  type Control,
  type FieldErrors,
  type FieldValues,
  type UseFormTrigger,
} from 'react-hook-form';
import { type z } from 'zod';

import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import type SCHEDULE_ACTIONS_NON_RUNNABLE_STATUSES_CONFIG from './config/schedule-actions-non-runnable-statuses.config';

export type ScheduleActionID = 'pause' | 'resume';

export type ScheduleActionInputParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type PauseScheduleSubmissionData = {
  reason: string;
};

export type ScheduleActionInput<SubmissionData> = ScheduleActionInputParams & {
  submissionData: SubmissionData;
};

export type ScheduleActionFormProps<FormData extends FieldValues> = {
  formData: FormData;
  fieldErrors: FieldErrors<FormData>;
  control: Control<FormData>;
  clearErrors: UseFormClearErrors<FormData>;
  trigger: UseFormTrigger<FormData>;
  cluster: string;
  domain: string;
  scheduleId: string;
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

export type ScheduleActionBannerIcon = (props: {
  size: IconProps['size'];
}) => ReactNode;

export type ScheduleActionModalBanner = {
  kind: ScheduleActionBannerKind;
  icon: ScheduleActionBannerIcon;
  render: (schedule?: DescribeScheduleResponse) => ReactNode;
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
    }
  | {
      withForm: false;
      form?: undefined;
      formSchema?: undefined;
      transformFormDataToSubmission?: undefined;
    };

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
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }>;
  getRunnableStatus: (
    schedule: DescribeScheduleResponse
  ) => ScheduleActionRunnableStatus;
  apiRoute: (params: ScheduleActionInputParams) => string;
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
