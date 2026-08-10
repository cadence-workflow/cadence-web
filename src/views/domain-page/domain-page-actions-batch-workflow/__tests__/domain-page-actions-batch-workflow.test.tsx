import React from 'react';

import { type IconProps } from 'baseui/icon';
import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';

import { type DomainPageActionButtonProps } from '../../domain-page-actions-dropdown/domain-page-actions-dropdown.types';
import DomainPageActionsBatchWorkflow from '../domain-page-actions-batch-workflow';

function MockIcon({ size }: IconProps) {
  return <span data-testid="mock-icon" data-size={size} />;
}

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [{ query: 'WorkflowType = "test"' }])
);

jest.mock(
  '../../domain-page-base-action-button/domain-page-base-action-button',
  () =>
    jest.fn(
      ({
        label,
        onClick,
        disabledReason,
      }: {
        label: string;
        onClick: () => void;
        disabledReason?: string;
      }) => (
        <button
          type="button"
          onClick={onClick}
          disabled={Boolean(disabledReason)}
          aria-label={disabledReason ?? label}
          data-testid="domain-page-base-action-button"
        >
          {label}
        </button>
      )
    )
);

describe(DomainPageActionsBatchWorkflow.name, () => {
  const defaultProps: DomainPageActionButtonProps = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    label: 'Batch workflow actions',
    icon: MockIcon,
    onCloseMenu: jest.fn(),
  };

  const originalWindow = window;

  beforeEach(() => {
    jest.clearAllMocks();

    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        ...originalWindow.location,
        search: '?status=RUNNING',
      },
      writable: true,
    });
  });

  afterEach(() => {
    window = originalWindow;
  });

  it('renders nothing when batch actions are disabled', async () => {
    setup(defaultProps, { enableBatchActions: false });

    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  it('renders nothing while batch actions config is loading', () => {
    setup(defaultProps, { isConfigLoading: true });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders nothing when batch actions config errors', async () => {
    setup(defaultProps, { isConfigError: true });

    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  it('renders the batch workflow action button when enabled', async () => {
    setup(defaultProps);

    expect(
      await screen.findByRole('button', { name: 'Batch workflow actions' })
    ).toBeInTheDocument();
  });

  it('navigates to batch actions with query params when clicked', async () => {
    const { user } = setup(defaultProps);

    await user.click(
      await screen.findByRole('button', { name: 'Batch workflow actions' })
    );

    expect(mockPush).toHaveBeenCalledWith(
      'batch-actions?status=RUNNING&baquery=WorkflowType+%3D+%22test%22&baid=draft'
    );
  });
});

function setup(
  props: DomainPageActionButtonProps,
  options: {
    enableBatchActions?: boolean;
    isConfigLoading?: boolean;
    isConfigError?: boolean;
  } = {}
) {
  const user = userEvent.setup();
  const {
    enableBatchActions = true,
    isConfigLoading = false,
    isConfigError = false,
  } = options;

  render(<DomainPageActionsBatchWorkflow {...props} />, {
    endpointsMocks: [
      {
        path: '/api/config',
        httpMethod: 'GET',
        mockOnce: false,
        httpResolver: async ({ request }) => {
          const url = new URL(request.url);
          const configKey = url.searchParams.get('configKey');

          if (configKey !== 'BATCH_ACTIONS_UI_ENABLED') {
            return HttpResponse.json(false);
          }

          if (isConfigError) {
            return HttpResponse.json(
              { error: 'Config error' },
              { status: 500 }
            );
          }

          if (isConfigLoading) {
            return new Promise(() => {});
          }

          return HttpResponse.json(
            enableBatchActions satisfies GetConfigResponse<'BATCH_ACTIONS_UI_ENABLED'>
          );
        },
      },
    ],
  });

  return { user };
}
