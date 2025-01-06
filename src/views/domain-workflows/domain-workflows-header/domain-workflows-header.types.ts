import { type ListWorkflowsCronValue } from '@/route-handlers/list-workflows/list-workflows.types';

export type Props = {
  domain: string;
  cluster: string;
};

export type WorkflowCronValue = ListWorkflowsCronValue;
