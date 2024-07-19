import { Suspense } from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen, act } from '@/test-utils/rtl';

import * as updateDomainModule from '@/server-actions/update-domain/update-domain';
import * as requestModule from '@/utils/request';

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

jest.mock('@/utils/request');

jest.mock('@/server-actions/update-domain/update-domain');

describe(DomainPageSettings.name, () => {
  it('renders settings without error', async () => {
    await setup({});

    expect(await screen.findByText('Mock settings table')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Description: This is a mock domain used for test fixtures'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Retention Period: 86400')).toBeInTheDocument();
  });

  it('submits modified settings without error', async () => {
    const { user, requestMock, updateDomainMock } = await setup({});

    expect(requestMock).toHaveBeenCalledTimes(1);
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

    expect(requestMock).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByText('Successfully updated domain settings')
    ).toBeInTheDocument();
  });

  it('submits modified settings with error', async () => {
    const { user, requestMock, updateDomainMock } = await setup({
      updateError: true,
    });

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
        'Error updating domain settings: Failed to update domain'
      )
    ).toBeInTheDocument();
    expect(requestMock).toHaveBeenCalledTimes(1);
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

    expect(renderErrorMessage).toEqual('Failed to fetch domain settings');
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
  // TODO: @adhitya.mamallan - This is not type-safe, move to msw when ready
  const requestMock = jest.spyOn(requestModule, 'default') as jest.Mock;
  const updateDomainMock = jest.spyOn(
    updateDomainModule,
    'default'
  ) as jest.Mock;

  if (dataError) {
    requestMock.mockRejectedValue(new Error('Failed to fetch domain settings'));
  } else {
    requestMock.mockResolvedValue({
      json: () => Promise.resolve(mockDomainInfo),
    });
  }

  if (updateError) {
    updateDomainMock.mockRejectedValue(new Error('Failed to update domain'));
  } else {
    updateDomainMock.mockResolvedValue({
      json: () => Promise.resolve(mockDomainInfo),
    });
  }

  render(
    <Suspense>
      <DomainPageSettings domain="mock-domain" cluster="mock-cluster" />
    </Suspense>
  );

  return { user, requestMock, updateDomainMock };
}
