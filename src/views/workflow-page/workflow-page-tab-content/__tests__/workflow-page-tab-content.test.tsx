import React from 'react';
import { render } from '@/test-utils/rtl';
import WorkflowPageTabContent from '../workflow-page-tab-content';
import type { WorkflowPageTabContentProps } from '../workflow-page-tab-content.types';

jest.mock('../../config/workflow-page-tabs-contents-map.config', () => ({
  summary: ({ params }: WorkflowPageTabContentProps) => (
    <div>{JSON.stringify(params)}</div>
  ),
}));

const params: WorkflowPageTabContentProps['params'] = {
  cluster: 'example-cluster',
  domain: 'example-domain',
  runId: 'example-runId',
  workflowId: 'example-workflowId',
  workflowTab: 'summary',
};

describe('WorkflowPageTabContent', () => {
  it('renders tab content with correct params when workflowTab exists in contentsMap', () => {
    const { getByText } = render(<WorkflowPageTabContent params={params} />);
    expect(getByText(JSON.stringify(params))).toBeInTheDocument();
  });

  it('does not return any tab cotent if workflowTab is not present in the contentsMap', () => {
    const paramsWithoutTabContent = { ...params, workflowTab: 'unkown-tab' };
    const { container } = render(
      //@ts-ignore allow passing unknown workflowtab to test recieving wrong value as a param
      <WorkflowPageTabContent params={paramsWithoutTabContent} />
    );
    expect(container.firstChild?.textContent).toBe('');
  });
});
