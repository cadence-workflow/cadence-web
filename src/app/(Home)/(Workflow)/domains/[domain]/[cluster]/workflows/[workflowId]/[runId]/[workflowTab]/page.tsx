import WorkflowPageTabContent from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content';
import { type Props } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

export default async function WorkflowPageTabContentPage(props: {
  params: Promise<Props['params']>;
}) {
  return <WorkflowPageTabContent params={await props.params} />;
}
