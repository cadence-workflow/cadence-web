import {
  MdListAlt,
  MdOutlineHistory,
  MdOutlineManageSearch,
  MdOutlineTerminal,
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
  {
    key: 'stackTrace',
    title: 'Stack Trace',
    artwork: MdOutlineTerminal,
  },
] as const satisfies WorkflowPageTabs;

export default workflowPageTabsConfig;
