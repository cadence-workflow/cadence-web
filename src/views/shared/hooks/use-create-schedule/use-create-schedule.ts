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
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchedules', { domain, cluster }],
      });
    },
  });
}
