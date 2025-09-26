import React from 'react';

import { HttpResponse } from 'msw';
import { type FieldErrors, useForm } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type ResetPoints } from '@/__generated__/proto-ts/uber/cadence/api/v1/ResetPoints';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import WorkflowActionResetForm from '../workflow-action-reset-form';
import { type ResetWorkflowFormData } from '../workflow-action-reset-form.types';

const resetPoints = {
  points: [
    {
      binaryChecksum: 'test-binary-checksum',
      runId: 'test-run-id',
      firstDecisionCompletedId: '4',
      resettable: false,
      createdTime: null,
      expiringTime: null,
    },
    {
      binaryChecksum: 'test-binary-checksum-2',
      runId: 'test-run-id',
      firstDecisionCompletedId: '7',
      resettable: true,
      createdTime: null,
      expiringTime: null,
    },
    {
      binaryChecksum: 'test-binary-checksum-3',
      runId: 'test-run-id',
      firstDecisionCompletedId: '10',
      resettable: true,
      createdTime: null,
      expiringTime: null,
    },
  ],
};
describe('WorkflowActionResetForm', () => {
  it('renders all form fields correctly', async () => {
    await setup({});

    expect(screen.getByPlaceholderText('Find Event ID')).toBeInTheDocument();
    expect(screen.getByText('Skip signal re-apply')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter reason for reset')
    ).toBeInTheDocument();
  });

  it('displays error when form has errors', async () => {
    const formErrors = {
      decisionFinishEventId: {
        message: 'Event ID is required',
        type: 'required',
      },
      reason: { message: 'Reason is required', type: 'required' },
    };

    await setup({ formErrors });

    const eventIdInput = screen.getByPlaceholderText('Find Event ID');
    expect(eventIdInput).toHaveAttribute('aria-invalid', 'true');

    const reasonInput = screen.getByPlaceholderText('Enter reason for reset');
    expect(reasonInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles input changes correctly', async () => {
    const { user } = await setup({});

    const eventIdInput = screen.getByPlaceholderText('Find Event ID');
    await user.type(eventIdInput, '123');
    expect(eventIdInput).toHaveValue(123);

    const reasonInput = screen.getByPlaceholderText('Enter reason for reset');
    await user.type(reasonInput, 'Test reason');
    expect(reasonInput).toHaveValue('Test reason');

    const skipSignalCheckbox = screen.getByRole('checkbox', {
      name: /skip signal re-apply/i,
    });
    await user.click(skipSignalCheckbox);
    expect(skipSignalCheckbox).toBeChecked();
  });

  it('renders with default values', async () => {
    await setup({});

    const eventIdInput = screen.getByPlaceholderText('Find Event ID');
    expect(eventIdInput).toHaveValue(null);

    const reasonInput = screen.getByPlaceholderText('Enter reason for reset');
    expect(reasonInput).toHaveValue('');

    const skipSignalCheckbox = screen.getByRole('checkbox', {
      name: /skip signal re-apply/i,
    });
    expect(skipSignalCheckbox).not.toBeChecked();
  });

  it('switches between Event ID and Binary Checksum reset types', async () => {
    const { user } = await setup({});

    const binaryChecksumRadio = screen.getByRole('radio', {
      name: 'Binary Checksum',
    });
    await user.click(binaryChecksumRadio);

    expect(
      screen.queryByPlaceholderText('Find Event ID')
    ).not.toBeInTheDocument();
    expect(screen.getByText('Select binary checksum')).toBeInTheDocument();

    const eventIdRadio = screen.getByRole('radio', {
      name: 'Event ID',
    });
    await user.click(eventIdRadio);

    expect(screen.getByPlaceholderText('Find Event ID')).toBeInTheDocument();
    expect(
      screen.queryByText('Select binary checksum')
    ).not.toBeInTheDocument();
  });

  it('lists only resettable points', async () => {
    const { user } = await setup({ resetPoints });

    const binaryChecksumRadio = screen.getByRole('radio', {
      name: 'Binary Checksum',
    });
    await user.click(binaryChecksumRadio);

    const binaryChecksumSelect = screen.getByRole('combobox', {
      name: 'Select binary checksum',
    });
    await user.click(binaryChecksumSelect);

    expect((await screen.findAllByRole('option')).length).toBe(2);
    expect(screen.getByText('test-binary-checksum-2')).toBeInTheDocument();
    expect(screen.getByText('test-binary-checksum-3')).toBeInTheDocument();
  });

  it('handles error state for bad binary fetch', async () => {
    const { user } = await setup({ isError: true });

    const binaryChecksumRadio = screen.getByRole('radio', {
      name: 'Binary Checksum',
    });
    await user.click(binaryChecksumRadio);

    const binaryChecksumSelect = screen.getByRole('combobox', {
      name: 'Select binary checksum',
    });

    await user.click(binaryChecksumSelect);

    expect(
      await screen.findByText('Failed to load binary checksums')
    ).toBeInTheDocument();
  });

  it('handles empty state', async () => {
    const { user } = await setup({ resetPoints: { points: [] } });

    const binaryChecksumRadio = screen.getByRole('radio', {
      name: 'Binary Checksum',
    });
    await user.click(binaryChecksumRadio);

    const binaryChecksumSelect = screen.getByRole('combobox', {
      name: 'Select binary checksum',
    });

    await user.click(binaryChecksumSelect);

    expect(await screen.findByText('No results found')).toBeInTheDocument();
  });
});

type TestProps = {
  formErrors: FieldErrors<ResetWorkflowFormData>;
  formData: ResetWorkflowFormData;
};

function TestWrapper({ formErrors, formData }: TestProps) {
  const methods = useForm<ResetWorkflowFormData>({
    defaultValues: formData,
  });

  return (
    <WorkflowActionResetForm
      trigger={methods.trigger}
      control={methods.control}
      clearErrors={methods.clearErrors}
      fieldErrors={formErrors}
      formData={formData}
      cluster="test-cluster"
      domain="test-domain"
      workflowId="test-workflow-id"
      runId="test-run-id"
    />
  );
}

async function setup({
  formErrors = {},
  formData = {
    decisionFinishEventId: '',
    reason: '',
    skipSignalReapply: false,
    resetType: 'EventId',
  },
  resetPoints = mockDescribeWorkflowResponse.workflowExecutionInfo
    .autoResetPoints,
  isError = false,
}: Partial<TestProps> & { resetPoints?: ResetPoints; isError?: boolean }) {
  const user = userEvent.setup();

  const describeWorkflowResponse = {
    ...mockDescribeWorkflowResponse,
    workflowExecutionInfo: {
      ...mockDescribeWorkflowResponse.workflowExecutionInfo,
      autoResetPoints: resetPoints,
    },
  };
  render(<TestWrapper formErrors={formErrors} formData={formData} />, {
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
  });

  return { user };
}
