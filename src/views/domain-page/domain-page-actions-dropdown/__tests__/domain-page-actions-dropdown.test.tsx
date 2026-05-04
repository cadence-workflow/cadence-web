import React, { useState } from 'react';

import { waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import { type WorkflowActionEnabledConfigValue } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';
import {
  mockWorkflowActionsConfig,
  mockStartActionConfig,
} from '@/views/workflow-actions/__fixtures__/workflow-actions-config';
import getActionDisabledReason from '@/views/workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason';

import DomainPageActionsDropdown from '../domain-page-actions-dropdown';
import type { Props } from '../domain-page-actions-dropdown.types';

const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({ push: mockRouterPush }),
}));

const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

jest.mock('@/views/workflow-actions/config/workflow-actions.config', () => {
  return {
    default: mockWorkflowActionsConfig,
    startWorkflowActionConfig: mockStartActionConfig,
  };
});

jest.mock('../../config/domain-page-actions.config', () => {
  const startAction = {
    id: 'start-workflow',
    label: 'Start new workflow',
    icon: () => 'start-icon',
  };
  const batchAction = {
    id: 'batch-workflow-actions',
    label: 'Batch workflow actions',
    icon: () => 'batch-icon',
  };
  return {
    __esModule: true,
    default: [startAction, batchAction],
    startWorkflowDomainAction: startAction,
    batchWorkflowDomainAction: batchAction,
  };
});

jest.mock('@/components/button/button', () =>
  jest.fn((props) => {
    return (
      <button
        onClick={props.onClick}
        data-testid="domain-actions-button"
        disabled={props.disabled}
      >
        {JSON.stringify({
          isLoading: props.isLoading,
        })}
        {props.children}
      </button>
    );
  })
);

jest.mock('baseui/popover', () => {
  return {
    ...jest.requireActual('baseui/popover'),
    StatefulPopover: jest.fn(({ content, children }) => {
      const [isShown, setIsShown] = useState(false);
      return (
        <>
          <div data-testid="popover-trigger" onClick={() => setIsShown(true)}>
            {children}
          </div>
          {isShown && (
            <div data-testid="popover-content">
              {typeof content === 'function'
                ? content({ close: () => setIsShown(false) })
                : content}
            </div>
          )}
        </>
      );
    }),
  };
});

jest.mock('baseui/tooltip', () => {
  return {
    ...jest.requireActual('baseui/tooltip'),
    StatefulTooltip: jest.fn((props) => {
      return (
        <>
          <div data-testid="tooltip">{props.content}</div>
          {props.children}
        </>
      );
    }),
  };
});

jest.mock(
  '@/views/workflow-actions/workflow-actions-modal/workflow-actions-modal',
  () =>
    jest.fn((props) => {
      return (
        <div data-testid="actions-modal">
          Actions Modal
          <button data-testid="close-modal-button" onClick={props.onClose}>
            Close
          </button>
        </div>
      );
    })
);

jest.mock(
  '@/views/workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason'
);
const mockGetActionDisabledReason = getActionDisabledReason as jest.Mock;

describe(DomainPageActionsDropdown.name, () => {
  const defaultProps: Props = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    isBatchActionsEnabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActionDisabledReason.mockReturnValue(undefined);
    mockUsePageQueryParams.mockReturnValue([{ query: '' }, jest.fn()]);
  });

  describe('trigger button', () => {
    it('renders the domain actions button', async () => {
      await setup(defaultProps);

      expect(screen.getByTestId('domain-actions-button')).toBeInTheDocument();
    });

    it('passes isLoading as true when config is loading', async () => {
      await setup(defaultProps, {
        isConfigLoading: true,
      });

      expect(screen.getByTestId('domain-actions-button')).toHaveTextContent(
        /"isLoading":true/
      );
    });

    it('passes isLoading as true when config errors', async () => {
      await setup(defaultProps, {
        isConfigError: true,
      });

      expect(screen.getByTestId('domain-actions-button')).toHaveTextContent(
        /"isLoading":true/
      );
    });
  });

  describe('menu actions', () => {
    it('shows only start workflow action when batch is disabled', async () => {
      const { user } = await setup(defaultProps);

      await user.click(screen.getByTestId('popover-trigger'));

      expect(screen.getByText('Start new workflow')).toBeInTheDocument();
      expect(
        screen.queryByText('Batch workflow actions')
      ).not.toBeInTheDocument();
    });

    it('shows both actions when batch is enabled', async () => {
      const { user } = await setup({
        ...defaultProps,
        isBatchActionsEnabled: true,
      });

      await user.click(screen.getByTestId('popover-trigger'));

      expect(screen.getByText('Start new workflow')).toBeInTheDocument();
      expect(screen.getByText('Batch workflow actions')).toBeInTheDocument();
    });

    it('disables start workflow when action config disables it', async () => {
      const disabledReason = 'Workflow action has been disabled';
      mockGetActionDisabledReason.mockReturnValue(disabledReason);

      const { user } = await setup(defaultProps);

      await user.click(screen.getByTestId('popover-trigger'));

      expect(screen.getByText(disabledReason)).toBeInTheDocument();
    });

    it('calls getActionDisabledReason with correct parameters', async () => {
      await setup(defaultProps, {
        startActionEnabledConfig: 'ENABLED',
      });

      await waitFor(() => {
        expect(mockGetActionDisabledReason).toHaveBeenCalledWith({
          actionEnabledConfig: 'ENABLED',
          actionRunnableStatus: 'RUNNABLE',
        });
      });
    });
  });

  describe('start workflow modal', () => {
    it('opens modal when start workflow is clicked', async () => {
      const { user } = await setup(defaultProps);

      await user.click(screen.getByTestId('popover-trigger'));

      expect(screen.queryByTestId('actions-modal')).not.toBeInTheDocument();

      await user.click(screen.getByText('Start new workflow'));

      expect(screen.getByTestId('actions-modal')).toBeInTheDocument();
    });

    it('closes modal when onClose is called', async () => {
      const { user } = await setup(defaultProps);

      await user.click(screen.getByTestId('popover-trigger'));
      await user.click(screen.getByText('Start new workflow'));

      expect(screen.getByTestId('actions-modal')).toBeInTheDocument();

      await user.click(screen.getByTestId('close-modal-button'));

      expect(screen.queryByTestId('actions-modal')).not.toBeInTheDocument();
    });
  });

  describe('batch workflow actions', () => {
    it('navigates to batch-actions tab with empty batch-query when clicked without a workflows query', async () => {
      const { user } = await setup({
        ...defaultProps,
        isBatchActionsEnabled: true,
      });

      await user.click(screen.getByTestId('popover-trigger'));
      await user.click(screen.getByText('Batch workflow actions'));

      expect(mockRouterPush).toHaveBeenCalledWith('batch-actions?batch-query=');
    });

    it('seeds batch-query from current query when navigating', async () => {
      mockUsePageQueryParams.mockReturnValue([
        { query: 'WorkflowType="foo"' },
        jest.fn(),
      ]);
      const { user } = await setup({
        ...defaultProps,
        isBatchActionsEnabled: true,
      });

      await user.click(screen.getByTestId('popover-trigger'));
      await user.click(screen.getByText('Batch workflow actions'));

      const pushedTo = mockRouterPush.mock.calls[0][0];
      const url = new URL(pushedTo, 'http://example.com/');
      expect(url.pathname).toBe('/batch-actions');
      expect(url.searchParams.get('batch-query')).toBe('WorkflowType="foo"');
    });

    it('preserves existing URL search params when navigating', async () => {
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { ...originalLocation, search: '?input=query&query=foo' },
      });

      const { user } = await setup({
        ...defaultProps,
        isBatchActionsEnabled: true,
      });

      await user.click(screen.getByTestId('popover-trigger'));
      await user.click(screen.getByText('Batch workflow actions'));

      const pushedTo = mockRouterPush.mock.calls[0][0];
      const url = new URL(pushedTo, 'http://example.com/');
      expect(url.searchParams.get('input')).toBe('query');
      expect(url.searchParams.get('query')).toBe('foo');
      expect(url.searchParams.get('batch-query')).toBe('');

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: originalLocation,
      });
    });
  });
});

function setup(
  props: Props,
  options: {
    startActionEnabledConfig?: WorkflowActionEnabledConfigValue;
    isConfigLoading?: boolean;
    isConfigError?: boolean;
  } = {}
) {
  const user = userEvent.setup();
  const {
    startActionEnabledConfig = mockResolvedConfigValues.WORKFLOW_ACTIONS_ENABLED
      .start,
    isConfigLoading = false,
    isConfigError = false,
  } = options;

  const renderResult = render(<DomainPageActionsDropdown {...props} />, {
    endpointsMocks: [
      {
        path: '/api/config',
        httpMethod: 'GET',
        mockOnce: true,
        httpResolver: async () => {
          if (isConfigError) {
            return HttpResponse.json(
              { error: 'Config error' },
              { status: 500 }
            );
          }
          if (isConfigLoading) {
            return new Promise(() => {});
          }

          const response = {
            ...mockResolvedConfigValues.WORKFLOW_ACTIONS_ENABLED,
            start: startActionEnabledConfig,
          };
          return HttpResponse.json(response);
        },
      },
    ],
  });

  return {
    user,
    ...renderResult,
  };
}
