import { MdListAlt, MdOutlineHistory } from 'react-icons/md';

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
] as const satisfies WorkflowPageTabs;

export default workflowPageTabsConfig;
