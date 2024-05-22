import React from 'react';
import { render } from '@/test-utils/rtl';
import WorkflowPageTabContent from '../workflow-page-tab-content';
import type {
  WorkflowPageTabContentProps,
  WorkflowPageTabsContentsMap,
} from '../workflow-page-tab-content.types';

const MockedTabContent = ({ params }: WorkflowPageTabContentProps) => (
  <div>{JSON.stringify(params)}</div>
);

const mockedTabContentsMap: WorkflowPageTabsContentsMap = {
  summary: MockedTabContent,
};

const params: WorkflowPageTabContentProps['params'] = {
  cluster: 'example-cluster',
  domain: 'example-domain',
  runId: 'example-runId',
  workflowId: 'example-workflowId',
  workflowTab: 'summary',
};

describe('WorkflowPageTabContent', () => {
  it('renders tab content with correct params when workflowTab exists in contentsMap', () => {
    const { getByText } = render(
      <WorkflowPageTabContent
        params={params}
        tabsContentMap={mockedTabContentsMap}
      />
    );
    expect(getByText(JSON.stringify(params))).toBeInTheDocument();
  });

  it('does not return any tab cotent if workflowTab is not present in the contentsMap', () => {
    const paramsWithoutTabContent = { ...params, workflowTab: 'unkown-tab' };
    //@ts-ignore allow passing unknown workflowtab to test recieving wrong value as a param
    const { container } = render(
      <WorkflowPageTabContent params={paramsWithoutTabContent} />
    );
    expect(container.firstChild?.textContent).toBe('');
  });
});
