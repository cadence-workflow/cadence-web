import type usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type WorkflowStatusBasicVisibility = WorkflowStatus | 'ALL_CLOSED';

export type Props = ReturnType<typeof usePageFilters>;
