import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { act, render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { describeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import { mockWorkflowDetailsParams } from '../../workflow-page/__fixtures__/workflow-details-params';
import { mockWorkflowActionsConfig } from '../__fixtures__/workflow-actions-config';
import WorkflowActions from '../workflow-actions';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => mockWorkflowDetailsParams,
}));

jest.mock('../workflow-actions-modal/workflow-actions-modal', () =>
  jest.fn((props) => {
    return props.action ? (
      <div data-testid="actions-modal">Actions Modal</div>
    ) : null;
  })
);

jest.mock('../workflow-actions-menu/workflow-actions-menu', () =>
  jest.fn((props) => {
    const areAllActionsDisabled = props.actionsEnabledConfig
      ? Object.entries(props.actionsEnabledConfig).every(
          ([_, value]) => value === false
        )
      : true;

    return (
      <div
        onClick={() => props.onActionSelect(mockWorkflowActionsConfig[0])}
        data-testid="actions-menu"
      >
        Actions Menu{areAllActionsDisabled ? ' (disabled)' : ''}
      </div>
    );
  })
);

describe(WorkflowActions.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button with the correct text', async () => {
    await setup({});

    const actionsButton = await screen.findByRole('button');
    expect(actionsButton).toHaveAttribute(
      'aria-label',
      expect.stringContaining('loading')
    );

    await waitFor(() => {
      expect(actionsButton).not.toHaveAttribute(
        'aria-label',
        expect.stringContaining('loading')
      );
    });

    expect(actionsButton).toHaveTextContent('Workflow Actions');
  });

  it('renders the menu when the button is clicked', async () => {
    const { user } = await setup({});

    const actionsButton = await screen.findByRole('button');
    await user.click(actionsButton);

    expect(await screen.findByTestId('actions-menu')).toBeInTheDocument();
  });

  it('renders the button with disabled configs if config fetching fails', async () => {
    const { user } = await setup({ isConfigError: true });

    const actionsButton = await screen.findByRole('button');
    await user.click(actionsButton);

    const actionsMenu = await screen.findByTestId('actions-menu');
    expect(actionsMenu).toBeInTheDocument();
    expect(actionsMenu).toHaveTextContent('Actions Menu (disabled)');
  });

  it('shows the modal when a menu option is clicked', async () => {
    const { user } = await setup({});

    const actionsButton = await screen.findByRole('button');
    await user.click(actionsButton);
    await user.click(await screen.findByTestId('actions-menu'));

    expect(await screen.findByTestId('actions-modal')).toBeInTheDocument();
  });

  it('renders nothing if describeWorkflow fails', async () => {
    let renderErrorMessage;
    try {
      await act(async () => {
        await setup({ isError: true });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch workflow summary');
  });
});

async function setup({
  isError,
  isConfigError,
}: {
  isError?: boolean;
  isConfigError?: boolean;
}) {
  const user = userEvent.setup();

  const renderResult = render(
    <Suspense>
      <WorkflowActions />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          httpResolver: () => {
            if (isError) {
              return HttpResponse.json(
                { message: 'Failed to fetch workflow summary' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json(describeWorkflowResponse, {
                status: 200,
              });
            }
          },
        },
        {
          path: '/api/config',
          httpMethod: 'GET',
          httpResolver: () => {
            if (isConfigError) {
              return HttpResponse.json(
                { message: 'Failed to fetch config' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json(
                {
                  terminate: true,
                  cancel: true,
                },
                {
                  status: 200,
                }
              );
            }
          },
        },
      ],
    }
  );

  return { user, renderResult };
}
