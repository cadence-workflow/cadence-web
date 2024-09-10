import React, { Suspense } from 'react';

import decodeUrlParams from '@/utils/decode-url-params';

import TaskListFilters from './task-list-filters/task-list-filters';
import TaskListLoader from './task-list-loader/task-list-loader';
import { type RouteParams, type Props } from './task-list-page.types';

export default function TaskListPage(props: Props) {
  const decodedParams = decodeUrlParams(props.params) as RouteParams;

  return (
    <Suspense>
      <TaskListFilters />
      <TaskListLoader {...decodedParams} />
    </Suspense>
  );
}
