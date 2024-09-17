import {
  MdListAlt,
  MdOutlineHistory,
  MdOutlineManageSearch,
} from 'react-icons/md';

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
    artwork: MdOutlineHistory,
  },
  {
    key: 'queries',
    title: 'Queries',
    artwork: MdOutlineManageSearch,
  },
] as const satisfies WorkflowPageTabs;

export default workflowPageTabsConfig;
