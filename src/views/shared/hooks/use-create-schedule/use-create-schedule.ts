'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type CreateScheduleResponseBody } from '@/route-handlers/create-schedule/create-schedule.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import {
  type UseCreateScheduleParams,
  type UseCreateScheduleResult,
  type UseCreateScheduleVariables,
} from './use-create-schedule.types';

export default function useCreateSchedule({
  domain,
  cluster,
  invalidateQueriesTimeout = 2000,
}: UseCreateScheduleParams): UseCreateScheduleResult {
  const queryClient = useQueryClient();

  return useMutation<
    CreateScheduleResponseBody,
    RequestError,
    UseCreateScheduleVariables
  >({
    mutationFn: (variables) =>
      request(
        `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/schedules`,
        {
          method: 'POST',
          body: JSON.stringify(variables),
        }
      ).then((res) => res.json()),
    onSuccess: () => {
      // New schedule doesn't appear immediately in the list, add a delay to ensure it appears.
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['listSchedules', { domain, cluster }],
        });
      }, invalidateQueriesTimeout);
    },
  });
}
