import WorkflowPage from '@/views/workflow-page/workflow-page';
import { generateWorkflowPageMetadata } from '@/views/workflow-page/workflow-page.metadata';
import { type Props } from '@/views/workflow-page/workflow-page.types';

export { generateWorkflowPageMetadata as generateMetadata };

export default async function WorkflowPageLayout(props: {
  params: Promise<Props['params']>;
  children: React.ReactNode;
}) {
  return (
    <WorkflowPage params={await props.params}>{props.children}</WorkflowPage>
  );
}
