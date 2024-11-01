import {
  MdListAlt,
  MdOutlineHistory,
  MdOutlineManageSearch,
  MdOutlineTerminal,
} from 'react-icons/md';

import WorkflowPagePendingEventsBadge from '../workflow-page-pending-events-badge/workflow-page-pending-events-badge';
import type { WorkflowPageTabs } from '../workflow-page-tabs/workflow-page-tabs.types';

const workflowPageTabsConfig = [
  {
    key: 'summary',
    title: 'Summary',
    artwork: MdListAlt,
  },
  {
    key: 'history',
    title: 'History',
    endEnhancer: WorkflowPagePendingEventsBadge,
    artwork: MdOutlineHistory,
  },
  {
    key: 'queries',
    title: 'Queries',
    artwork: MdOutlineManageSearch,
  },
  {
    key: 'stack-trace',
    title: 'Stack Trace',
    artwork: MdOutlineTerminal,
  },
] as const satisfies WorkflowPageTabs;

export default workflowPageTabsConfig;
