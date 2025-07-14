import React from 'react';

import { render } from '@/test-utils/rtl';

import { mockWorkflowPageTabsConfig } from '../../__fixtures__/workflow-page-tabs-config';
import WorkflowPageTabContent from '../workflow-page-tab-content';
import type { WorkflowPageTabContentProps } from '../workflow-page-tab-content.types';

jest.mock(
  '../../config/workflow-page-tabs.config',
  () => mockWorkflowPageTabsConfig
);

const params: WorkflowPageTabContentProps['params'] = {
  cluster: 'example-cluster',
  domain: 'example-domain',
  runId: 'example-runId',
  workflowId: 'example-workflowId',
  workflowTab: 'summary',
};

describe('WorkflowPageTabContent', () => {
  it('renders tab content with correct params when workflowTab exists in config', () => {
    const { getByText } = render(<WorkflowPageTabContent params={params} />);
    expect(getByText(JSON.stringify(params))).toBeInTheDocument();
  });

  it('does not return any tab content if workflowTab is not present in the config', () => {
    const paramsWithoutTabContent = { ...params, workflowTab: 'unknown-tab' };
    const { container } = render(
      // @ts-expect-error allow passing unknown workflowtab to test receiving wrong value as a param
      <WorkflowPageTabContent params={paramsWithoutTabContent} />
    );
    expect(container.firstChild?.textContent).toBe('');
  });
});
