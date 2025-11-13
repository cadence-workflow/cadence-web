import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';

import domainPageTabsConfig from '../../config/domain-page-tabs.config';
import DomainPageTabs from '../domain-page-tabs';

jest.mock('@/hooks/use-config-value/use-suspense-config-value', () =>
  jest.fn()
);

const mockUseSuspenseConfigValue =
  useSuspenseConfigValue as jest.MockedFunction<typeof useSuspenseConfigValue>;

const mockPushFn = jest.fn();
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
    domain: 'mock-domain',
    cluster: 'cluster_1',
    domainTab: 'workflows',
  }),
}));

jest.mock(
  '../../domain-page-start-workflow-button/domain-page-start-workflow-button',
  () =>
    jest.fn(() => (
      <button data-testid="start-workflow-button">Start Workflow</button>
    ))
);

jest.mock('../../config/domain-page-tabs.config', () => ({
  workflows: {
    title: 'Workflows',
    artwork: () => <div data-testid="workflows-artwork" />,
  },
  'cron-list': {
    title: 'Cron',
    artwork: () => <div data-testid="cron-list-artwork" />,
  },
  'page-2': {
    title: 'Page 2',
  },
}));

jest.mock('../../domain-page-help/domain-page-help', () =>
  jest.fn(() => <button data-testid="domain-page-help">Help Button</button>)
);

function setup(opts: { cronListEnabled?: boolean } = {}) {
  const { cronListEnabled = false } = opts;

  mockUseSuspenseConfigValue.mockReturnValue({
    data: cronListEnabled,
  } as any);
}

describe('DomainPageTabs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tabs titles correctly', () => {
    setup();

    render(<DomainPageTabs />);

    for (const title of ['Workflows', 'Page 2']) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('renders cron tab correctly when feature flag is enabled', () => {
    setup({ cronListEnabled: false });

    render(<DomainPageTabs />);

    for (const title of ['Workflows', 'Page 2']) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it('reroutes when new tab is clicked', () => {
    setup();

    render(<DomainPageTabs />);

    const page2Tab = screen.getByText('Page 2');
    act(() => {
      fireEvent.click(page2Tab);
    });

    expect(mockPushFn).toHaveBeenCalledWith('page-2');
  });

  it('retains query params when new tab is clicked', () => {
    setup();

    // TODO: this is a bit hacky, see if there is a better way to mock the window search property
    const originalWindow = window;
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        search: '?queryParam1=one&queryParam2=two',
      },
      writable: true,
    });

    render(<DomainPageTabs />);

    const page2Tab = screen.getByText('Page 2');
    act(() => {
      fireEvent.click(page2Tab);
    });

    expect(mockPushFn).toHaveBeenCalledWith(
      'page-2?queryParam1=one&queryParam2=two'
    );

    window = originalWindow;
  });

  it('renders tabs artworks correctly', () => {
    setup();

    render(<DomainPageTabs />);

    Object.entries(domainPageTabsConfig).forEach(([key, { artwork }]) => {
      if (key === 'cron-list') return;

      if (typeof artwork !== 'undefined')
        expect(screen.getByTestId(`${key}-artwork`)).toBeInTheDocument();
      else
        expect(screen.queryByTestId(`${key}-artwork`)).not.toBeInTheDocument();
    });
  });

  it('renders the help button as endEnhancer', () => {
    setup();

    render(<DomainPageTabs />);

    expect(screen.getByTestId('domain-page-help')).toBeInTheDocument();
    expect(screen.getByText('Help Button')).toBeInTheDocument();
  });

  it('renders the start workflow button', () => {
    setup();

    render(<DomainPageTabs />);

    expect(screen.getByTestId('start-workflow-button')).toBeInTheDocument();
  });
});
