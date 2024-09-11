'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import PageSection from '@/components/page-section/page-section';
import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';
import request from '@/utils/request';
import TaskListLabel from '@/views/shared/task-list-label/task-list-label';

import { styled } from './task-list-loader.styles';
import { type Props } from './task-list-loader.types';

export default function TaskListLoader(props: Props) {
  const {
    data: { taskList },
  } = useSuspenseQuery<DescribeTaskListResponse>({
    queryKey: ['describeTaskList', props],
    queryFn: () =>
      request(
        `/api/domains/${props.domain}/${props.cluster}/task-list/${props.taskListName}`
      ).then((res) => res.json()),
  });

  return (
    <PageSection>
      <styled.TaskListContainer>
        <TaskListLabel taskList={taskList} isHighlighted={true} />
        <div>{'Task List Table placeholder: ' + JSON.stringify(taskList)}</div>
      </styled.TaskListContainer>
    </PageSection>
  );
}
