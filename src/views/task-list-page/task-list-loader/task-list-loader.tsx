'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';

import cadenceLogoBlack from '@/assets/cadence-logo-black.svg';
import PageSection from '@/components/page-section/page-section';
import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';
import request from '@/utils/request';
import TaskListLabel from '@/views/shared/task-list-label/task-list-label';

import TaskListFilters from '../task-list-filters/task-list-filters';
import TaskListWorkersTable from '../task-list-workers-table/task-list-workers-table';

import { TASK_LIST_REFETCH_INTERVAL_MS } from './task-list-loader.constants';
import { styled } from './task-list-loader.styles';
import { type Props } from './task-list-loader.types';

export default function TaskListLoader(props: Props) {
  const {
    data: { taskList },
  } = useSuspenseQuery<DescribeTaskListResponse>({
    queryKey: ['describeTaskList', props],
    queryFn: () =>
      request(
        `/api/domains/${encodeURIComponent(props.domain)}/${encodeURIComponent(props.cluster)}/task-list/${encodeURIComponent(props.taskListName)}`
      ).then((res) => res.json()),
    refetchInterval: TASK_LIST_REFETCH_INTERVAL_MS,
  });

  return (
    <PageSection>
      <styled.TaskListContainer>
        <styled.TaskListHeaderContainer>
          <Image
            width={22}
            height={22}
            alt="Cadence Icon"
            src={cadenceLogoBlack}
          />
          <TaskListLabel taskList={taskList} isHighlighted={true} />
        </styled.TaskListHeaderContainer>
        <TaskListFilters />
        <TaskListWorkersTable taskList={taskList} />
      </styled.TaskListContainer>
    </PageSection>
  );
}
