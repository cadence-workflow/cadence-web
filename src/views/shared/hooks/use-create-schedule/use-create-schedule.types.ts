import { type CreateScheduleRequestBody } from '@/route-handlers/create-schedule/create-schedule.types';
import { type RequestError } from '@/utils/request/request-error';

export type UseCreateScheduleParams = {
  domain: string;
  cluster: string;
};

export type UseCreateScheduleVariables = CreateScheduleRequestBody;

export type UseCreateScheduleResult = {
  mutate: (variables: UseCreateScheduleVariables) => void;
  mutateAsync: (
    variables: UseCreateScheduleVariables
  ) => Promise<Record<string, never>>;
  isPending: boolean;
  error: RequestError | null;
  isSuccess: boolean;
  reset: () => void;
};
