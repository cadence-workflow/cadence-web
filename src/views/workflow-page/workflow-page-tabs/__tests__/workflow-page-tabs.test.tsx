import React from 'react';
import { render } from '@/test-utils/rtl';
import WorkflowPageTabs from '../workflow-page-tabs';
import type { Props } from '../workflow-page-tabs.types';
import workflowPageTabsConfig from '../../config/workflow-page-tabs.config';

jest.mock('../../config/workflow-page-tabs.config', () => [
  {
    key: 'summary',
    title: 'Summary',
    artwork: () => <div data-testid="summary-artwork" />,
  },
  {
    key: 'page-2',
    title: 'Page 2',
  },
]);

describe('WorkflowPageTabs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tabs titles correctly', () => {
    const { getByText } = setup({});

    workflowPageTabsConfig.forEach(({ title }) => {
      expect(getByText(title)).toBeInTheDocument();
    });
  });
  it('renders tabs artworks correctly', () => {
    const { queryByTestId, getByTestId } = setup({});
    workflowPageTabsConfig.forEach(({ key, artwork }) => {
      if (typeof artwork !== 'undefined')
        expect(getByTestId(`${key}-artwork`)).toBeInTheDocument();
      else expect(queryByTestId(`${key}-artwork`)).not.toBeInTheDocument();
    });
  });

  it('renders children', () => {
    const { getByText } = setup({
      children: <div>Mock Children</div>,
    });
    expect(getByText('Mock Children')).toBeInTheDocument();
  });
});

function setup({
  params = {
    cluster: 'example-cluster',
    domain: 'example-domain',
    runId: 'example-runId',
    workflowId: 'example-workflowId',
    workflowTab: 'summary',
  },
  children = null,
}: Partial<Props>) {
  return render(
    <WorkflowPageTabs params={params}>{children}</WorkflowPageTabs>
  );
}
