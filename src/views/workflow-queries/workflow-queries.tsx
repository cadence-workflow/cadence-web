'use client';

import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WorkflowQueriesLoader from './workflow-queries-loader/workflow-queries-loader';

export default function WorkflowQueries(props: WorkflowPageTabContentProps) {
  return <WorkflowQueriesLoader {...props.params} />;
}
