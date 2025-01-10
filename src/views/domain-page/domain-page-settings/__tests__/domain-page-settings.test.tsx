import { Suspense } from 'react';

import { userEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import { type DescribeDomainResponse } from '@/route-handlers/describe-domain/describe-domain.types';
import { type UpdateDomainResponse } from '@/route-handlers/update-domain/update-domain.types';
import type { Props as MSWMocksHandlersProps } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';

import { mockDomainInfo } from '../../__fixtures__/domain-info';
import { type DomainInfo } from '../../domain-page.types';
import DomainPageSettings from '../domain-page-settings';
import { type SettingsValues } from '../domain-page-settings.types';

const mockDomainSettings: SettingsValues = {
  description: 'Mock new description',
  retentionPeriodSeconds: 172800,
  historyArchival: true,
  visibilityArchival: true,
};

jest.mock('@/views/shared/settings-form/settings-form', () =>
  jest.fn(
    ({
      data,
      onSubmit,
      onSubmitError,
    }: {
      data: DomainInfo;
      onSubmit: (v: any) => Promise<void>;
      onSubmitError: (e: any) => void;
    }) => (
      <div>
        Mock settings table
        <div>Description: {data.description}</div>
        <div>
          {`Retention Period: ${data.workflowExecutionRetentionPeriod?.seconds}`}
        </div>
        <button
          onClick={async () =>
            await onSubmit(mockDomainSettings).catch(onSubmitError)
          }
        >
          Save settings
        </button>
      </div>
    )
  )
);

describe(DomainPageSettings.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders settings without error', async () => {
    await setup({});

    expect(await screen.findByText('Mock settings table')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Description: This is a mock domain used for test fixtures (Update 0)'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Retention Period: 86400')).toBeInTheDocument();
  });

  it('submits modified settings without error', async () => {
    const { user, updateDomainMock } = await setup({});

    expect(await screen.findByText(/Update 0/)).toBeInTheDocument();
    const submitButton = await screen.findByText('Save settings');
    await user.click(submitButton);

    expect(updateDomainMock).toHaveBeenCalledWith({
      cluster: 'mock-cluster',
      domain: 'mock-domain',
      values: {
        description: 'Mock new description',
        historyArchivalStatus: 'ARCHIVAL_STATUS_ENABLED',
        visibilityArchivalStatus: 'ARCHIVAL_STATUS_ENABLED',
        workflowExecutionRetentionPeriod: {
          seconds: 172800,
        },
      },
    });

    expect(await screen.findByText(/Update 1/)).toBeInTheDocument();
    expect(
      await screen.findByText('Successfully updated domain settings')
    ).toBeInTheDocument();
  });

  it('submits modified settings with error', async () => {
    const { user, updateDomainMock } = await setup({
      updateError: true,
    });

    expect(await screen.findByText(/Update 0/)).toBeInTheDocument();
    const submitButton = await screen.findByText('Save settings');
    await user.click(submitButton);

    expect(updateDomainMock).toHaveBeenCalledWith({
      cluster: 'mock-cluster',
      domain: 'mock-domain',
      values: {
        description: 'Mock new description',
        historyArchivalStatus: 'ARCHIVAL_STATUS_ENABLED',
        visibilityArchivalStatus: 'ARCHIVAL_STATUS_ENABLED',
        workflowExecutionRetentionPeriod: {
          seconds: 172800,
        },
      },
    });

    expect(
      await screen.findByText(
        'Error updating domain settings: Failed to update domain information'
      )
    ).toBeInTheDocument();
    expect(await screen.findByText(/Update 0/)).toBeInTheDocument();
  });

  it('does not render if the initial data fetch fails', async () => {
    let renderErrorMessage;
    try {
      await act(async () => {
        await setup({ dataError: true });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch domain information');
  });
});

async function setup({
  dataError,
  updateError,
}: {
  dataError?: boolean;
  updateError?: boolean;
}) {
  const user = userEvent.setup();
  const updateDomainMock = jest.fn();
  let currentEventIndex = 0;

  render(
    <Suspense>
      <DomainPageSettings domain="mock-domain" cluster="mock-cluster" />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            const index = currentEventIndex;
            currentEventIndex++;

            if (dataError) {
              return HttpResponse.json(
                { message: 'Failed to fetch domain information' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json({
                ...mockDomainInfo,
                description: mockDomainInfo.description + ` (Update ${index})`,
              } satisfies DescribeDomainResponse);
            }
          },
        },
        {
          path: '/api/domains/:domain/:cluster/update',
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async (info) => {
            const bodyJson = await info.request.json();
            updateDomainMock({
              domain: info.params.domain,
              cluster: info.params.cluster,
              values: bodyJson,
            });

            if (updateError) {
              return HttpResponse.json(
                { message: 'Failed to update domain information' },
                { status: 500 }
              );
            }
            return HttpResponse.json({
              ...mockDomainInfo,
              description:
                mockDomainInfo.description +
                ` (Update ${currentEventIndex + 1})`,
            } satisfies UpdateDomainResponse);
          },
        },
      ] as MSWMocksHandlersProps['endpointsMocks'],
    }
  );

  return { user, updateDomainMock };
}
