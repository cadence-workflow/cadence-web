import WorkflowPage from '@/views/workflow-page/workflow-page';
import { type Props } from '@/views/workflow-page/workflow-page.types';

export default async function WorkflowPageLayout(props: {
  params: Promise<Props['params']>;
  children: React.ReactNode;
}) {
  return (
    <WorkflowPage params={await props.params}>{props.children}</WorkflowPage>
  );
}
