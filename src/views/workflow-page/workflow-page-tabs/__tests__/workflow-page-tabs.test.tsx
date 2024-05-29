import React from 'react';
import { render, screen } from '@/test-utils/rtl';
import WorkflowPageTabs from '../workflow-page-tabs';
import workflowPageTabsConfig from '../../config/workflow-page-tabs.config';

const mockPushFn = jest.fn();
//TODO @assem.hafez  create testing util for router
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockPushFn,
    back: () => {},
    replace: () => {},
    forward: () => {},
    prefetch: () => {},
    refresh: () => {},
  }),
  useParams: () => ({
    cluster: 'example-cluster',
    domain: 'example-domain',
    runId: 'example-runId',
    workflowId: 'example-workflowId',
    workflowTab: 'summary',
  }),
}));

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
    setup();

    workflowPageTabsConfig.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
  it('renders tabs artworks correctly', () => {
    setup();
    workflowPageTabsConfig.forEach(({ key, artwork }) => {
      if (typeof artwork !== 'undefined')
        expect(screen.getByTestId(`${key}-artwork`)).toBeInTheDocument();
      else
        expect(screen.queryByTestId(`${key}-artwork`)).not.toBeInTheDocument();
    });
  });
});

function setup() {
  return render(<WorkflowPageTabs />);
}
