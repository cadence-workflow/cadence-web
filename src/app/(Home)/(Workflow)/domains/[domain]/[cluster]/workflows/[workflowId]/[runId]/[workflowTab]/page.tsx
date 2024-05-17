import { worflowPageTabsConfig } from '@/views/workflow-page/config/workflow-page-tabs.config';
import WorkflowPageTabContent from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content';

export default WorkflowPageTabContent;

export async function generateStaticParams() {
  return worflowPageTabsConfig.map(({ key }) => key);
}