'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import PageSection from '@/components/page-section/page-section';
import { type TaskList } from '@/route-handlers/describe-task-list/describe-task-list.types';
import request from '@/utils/request';

import { type Props } from './task-list-loader.types';

export default function TaskListLoader(props: Props) {
  const { data: taskList } = useSuspenseQuery<TaskList>({
    queryKey: ['describeTaskList', props],
    queryFn: () =>
      request(
        `/api/domains/${props.domain}/${props.cluster}/task-list/${props.taskListName}`
      ).then((res) => res.json()),
  });

  return (
    <PageSection>
      <div>Placeholder for Task List table</div>
      <div>{JSON.stringify(taskList)}</div>
    </PageSection>
  );
}
