import RedirectWorkflow from '@/views/redirect-workflow/redirect-workflow';
import { type Props } from '@/views/redirect-workflow/redirect-workflow.types';

export default async function RedirectWorkflowPage(props: {
  params: Promise<Props['params']>;
  searchParams?: Promise<Props['searchParams']>;
}) {
  return RedirectWorkflow({
    params: await props.params,
    searchParams: await props.searchParams,
  });
}
