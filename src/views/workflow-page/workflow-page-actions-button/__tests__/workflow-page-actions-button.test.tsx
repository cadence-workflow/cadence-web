import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { act, render, screen, userEvent } from '@/test-utils/rtl';

import { describeWorkflowResponse } from '../../__fixtures__/describe-workflow-response';
import { mockWorkflowPageActionsConfig } from '../../__fixtures__/workflow-actions-config';
import WorkflowPageActionsButton from '../workflow-page-actions-button';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    cluster: 'testCluster',
    domain: 'testDomain',
    workflowId: 'testWorkflowId',
    runId: 'testRunId',
  }),
}));

jest.mock('../../workflow-page-actions-modal/workflow-page-actions-modal', () =>
  jest.fn((props) => {
    return props.action ? (
      <div data-testid="actions-modal">Actions Modal</div>
    ) : null;
  })
);

jest.mock('../../workflow-page-actions-menu/workflow-page-actions-menu', () =>
  jest.fn((props) => {
    return (
      <div
        onClick={() => props.onActionSelect(mockWorkflowPageActionsConfig[0])}
        data-testid="actions-menu"
      >
        Actions Menu{props.disabled ? ' (disabled)' : ''}
      </div>
    );
  })
);

describe(WorkflowPageActionsButton.name, () => {
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
      <WorkflowPageActionsButton />
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
