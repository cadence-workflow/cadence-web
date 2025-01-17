import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { act, render, screen, userEvent } from '@/test-utils/rtl';

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
    return (
      <div
        onClick={() => props.onActionSelect(mockWorkflowActionsConfig[0])}
        data-testid="actions-menu"
      >
        Actions Menu{props.disabled ? ' (disabled)' : ''}
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
    expect(actionsButton).toHaveTextContent('Workflow Actions');
  });

  it('renders the menu when the button is clicked', async () => {
    const { user } = await setup({});

    await user.click(await screen.findByText('Workflow Actions'));

    expect(await screen.findByTestId('actions-menu')).toBeInTheDocument();
  });

  it('shows the modal when a menu option is clicked', async () => {
    const { user } = await setup({});

    await user.click(await screen.findByText('Workflow Actions'));
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

async function setup({ isError }: { isError?: boolean }) {
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
      ],
    }
  );

  return { user, renderResult };
}
