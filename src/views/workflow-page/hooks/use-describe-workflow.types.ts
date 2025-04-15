export type UseDescribeWorkflowParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  refetchInterval?: number;
};

export type DescribeWorkflowQueryKey = [
  'describe_workflow',
  Omit<UseDescribeWorkflowParams, 'refetchInterval'>,
];
