import { type Metadata } from 'next';

import WorkflowPage from '@/views/workflow-page/workflow-page';

type Props = {
  params: Promise<{ domain: string; cluster: string; workflowId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain, workflowId } = await params;
  return { title: `${domain} - ${workflowId}` };
}

export default WorkflowPage;
