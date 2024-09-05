import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import TaskListLoader from '../task-list-loader';

describe(TaskListLoader.name, () => {
  it('renders task list without error', async () => {
    await setup({});

    expect(
      await screen.findByText('Placeholder for Task List table')
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/poller-1@mock-domain@tasklist-1/)
    ).toBeInTheDocument();
  });

  it('does not render if the initial call fails', async () => {
    let renderErrorMessage;
    try {
      await act(async () => {
        await setup({ error: true });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch task list');
  });
});

async function setup({ error }: { error?: boolean }) {
  render(
    <Suspense>
      <TaskListLoader
        domain="mock-domain"
        cluster="mock-cluster"
        taskListName="tasklist-1"
      />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/task-list/:taskListName',
          httpMethod: 'GET',
          ...(error
            ? {
                httpResolver: () => {
                  return HttpResponse.json(
                    { message: 'Failed to fetch task list' },
                    { status: 500 }
                  );
                },
              }
            : {
                jsonResponse: {
                  taskList: {
                    pollers: [
                      {
                        activityHandler: true,
                        decisionHandler: true,
                        identity: 'poller-1@mock-domain@tasklist-1',
                        lastAccessTime: 1725370657336.2053,
                        ratePerSecond: 100000,
                      },
                      {
                        activityHandler: true,
                        decisionHandler: true,
                        identity: 'poller-2@mock-domain@tasklist-1',
                        lastAccessTime: 1725370636402.4927,
                        ratePerSecond: 100000,
                      },
                    ],
                  },
                },
              }),
        },
      ],
    }
  );
}
