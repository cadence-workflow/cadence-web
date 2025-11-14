import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';
import { mockConsoleError } from '@/test-utils/mock-console-error';

import DomainPageTabs from '../domain-page-tabs';

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
  metadata: {
    title: 'Metadata',
    artwork: () => <div data-testid="metadata-artwork" />,
  },
  failovers: {
    title: 'Failovers',
    artwork: () => <div data-testid="failovers-artwork" />,
  },
  settings: {
    title: 'Settings',
    artwork: () => <div data-testid="settings-artwork" />,
  },
  archival: {
    title: 'Archival',
    artwork: () => <div data-testid="archival-artwork" />,
  },
}));

jest.mock('../../domain-page-help/domain-page-help', () =>
  jest.fn(() => <button data-testid="domain-page-help">Help Button</button>)
);

describe(DomainPageTabs.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tabs titles correctly', async () => {
    await setup();

    expect(screen.getByText('Workflows')).toBeInTheDocument();
    expect(screen.getByText('Metadata')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Archival')).toBeInTheDocument();

    expect(screen.queryByText('Cron')).toBeNull();
    expect(screen.queryByText('Failovers')).toBeNull();
  });

  it('renders tabs with cron and failover history enabled', async () => {
    await setup({
      enableFailoverHistory: true,
      enableCronList: true,
    });

    expect(screen.getByText('Workflows')).toBeInTheDocument();
    expect(screen.getByText('Cron')).toBeInTheDocument();
    expect(screen.getByText('Metadata')).toBeInTheDocument();
    expect(screen.getByText('Failovers')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Archival')).toBeInTheDocument();
  });

  it('reroutes when new tab is clicked', async () => {
    const { user } = await setup();

    const metadataTab = await screen.findByText('Metadata');
    await user.click(metadataTab);

    expect(mockPushFn).toHaveBeenCalledWith('metadata');
  });

  it('retains query params when new tab is clicked', async () => {
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

    const { user } = await setup();

    const metadataTab = await screen.findByText('Metadata');
    await user.click(metadataTab);

    expect(mockPushFn).toHaveBeenCalledWith(
      'metadata?queryParam1=one&queryParam2=two'
    );

    window = originalWindow;
  });

  it('renders tabs artworks correctly', async () => {
    await setup();

    expect(screen.getByTestId('workflows-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('metadata-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('settings-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('archival-artwork')).toBeInTheDocument();
    expect(screen.queryByTestId('failovers-artwork')).toBeNull();
  });

  it('handles errors gracefully', async () => {
    // Mute console.error to avoid polluting the test output.
    const silencedErrorRegexes = [
      /RequestError: Failed to fetch config/,
      /The above error occurred in the <DomainPageTabs> component/,
    ];
    const { restore: restoreConsoleError } = mockConsoleError({
      silencedErrorRegexes,
    });

    try {
      await setup({ error: true });

      expect(
        await screen.findByText('Error: Failed to fetch config')
      ).toBeInTheDocument();
    } finally {
      // Be sure to restore the console.error.
      restoreConsoleError();
    }
  });

  it('renders the help button as endEnhancer', async () => {
    await setup({});

    expect(screen.getByTestId('domain-page-help')).toBeInTheDocument();
    expect(screen.getByText('Help Button')).toBeInTheDocument();
  });

  it('renders the start workflow button', async () => {
    await setup({});

    expect(screen.getByTestId('start-workflow-button')).toBeInTheDocument();
  });
});

async function setup(opts?: {
  error?: boolean;
  enableFailoverHistory?: boolean;
  enableCronList?: boolean;
}) {
  const { error, enableFailoverHistory, enableCronList } = opts ?? {};
  const user = userEvent.setup();

  render(
    <ErrorBoundary
      fallbackRender={({ error }) => <div>Error: {error.message}</div>}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <DomainPageTabs />
      </Suspense>
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch config' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json(
                ((enableFailoverHistory ??
                  false) satisfies GetConfigResponse<'FAILOVER_HISTORY_ENABLED'>) ||
                  ((enableCronList ??
                    false) satisfies GetConfigResponse<'CRON_LIST_ENABLED'>)
              );
            }
          },
        },
      ],
    }
  );

  if (!error) {
    // Wait for the first tab to load
    await screen.findByText('Workflows');
  }

  return { user };
}
