import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitForElementToBeRemoved } from '@/test-utils/rtl';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';

import { type Props } from '../../workflow-history.types';
import WorkflowHistoryWrapper from '../workflow-history-wrapper';

jest.mock('../../../workflow-history-v2/workflow-history-v2', () =>
  jest.fn(() => (
    <div data-testid="workflow-history-v2">Workflow History V2</div>
  ))
);

jest.mock('../../workflow-history', () =>
  jest.fn(() => <div data-testid="workflow-history">Workflow History V1</div>)
);

describe(WorkflowHistoryWrapper.name, () => {
  it('should render WorkflowHistoryV2 when HISTORY_PAGE_V2_ENABLED is true', async () => {
    await setup({ isHistoryPageV2Enabled: true });

    expect(screen.getByTestId('workflow-history-v2')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-history')).not.toBeInTheDocument();
  });

  it('should render WorkflowHistory when HISTORY_PAGE_V2_ENABLED is false', async () => {
    await setup({ isHistoryPageV2Enabled: false });

    expect(screen.getByTestId('workflow-history')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-history-v2')).not.toBeInTheDocument();
  });
});

async function setup({
  isHistoryPageV2Enabled = false,
  props = {
    params: {
      cluster: 'test-cluster',
      domain: 'test-domain',
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
      workflowTab: 'history' as const,
    },
  },
}: {
  isHistoryPageV2Enabled?: boolean;
  props?: Props;
} = {}) {
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowHistoryWrapper {...props} />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () =>
            HttpResponse.json(
              isHistoryPageV2Enabled satisfies GetConfigResponse<'HISTORY_PAGE_V2_ENABLED'>
            ),
        },
      ],
    }
  );

  await waitForElementToBeRemoved(() => screen.queryAllByText('Loading...'));
}
