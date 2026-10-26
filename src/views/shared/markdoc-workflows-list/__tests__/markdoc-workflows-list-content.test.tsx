import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import WorkflowsList from '@/views/shared/workflows-list/workflows-list';

import MarkdocWorkflowsListContent from '../markdoc-workflows-list-content';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock(
  '@/views/shared/workflows-list/hooks/use-workflows-list-columns',
  () => jest.fn(() => ({ availableColumns: [] }))
);

jest.mock('@/views/shared/workflows-list/workflows-list', () =>
  jest.fn(({ workflows }) => <div>Mock list: {workflows.length}</div>)
);

describe(MarkdocWorkflowsListContent.name, () => {
  it('renders the list with the fetched workflows', async () => {
    setup({});
    expect(await screen.findByText('Mock list: 1')).toBeInTheDocument();
  });

  it('limits the list height', async () => {
    setup({});
    await screen.findByText('Mock list: 1');
    expect(WorkflowsList).toHaveBeenCalledWith(
      expect.objectContaining({ maxHeight: '20vh' }),
      expect.anything()
    );
  });

  it('renders an error panel when the request fails', async () => {
    setup({ error: true });
    expect(
      await screen.findByText('Failed to fetch workflows')
    ).toBeInTheDocument();
  });
});

function setup({ error }: { error?: boolean }) {
  render(
    <MarkdocWorkflowsListContent
      query="WorkflowType='x'"
      domain="d"
      cluster="c"
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () =>
            error
              ? HttpResponse.json({ message: 'fail' }, { status: 500 })
              : HttpResponse.json({
                  workflows: [{ workflowID: 'w1', runID: 'r1' }],
                  nextPage: '',
                }),
        },
      ],
    }
  );
}
