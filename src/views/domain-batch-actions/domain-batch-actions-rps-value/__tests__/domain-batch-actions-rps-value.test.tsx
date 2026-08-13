import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type BatchAction } from '../../domain-batch-actions.types';
import DomainBatchActionRpsValue from '../domain-batch-actions-rps-value';
import { type Props } from '../domain-batch-actions-rps-value.types';

const mockEditRps = jest.fn();
jest.mock('../../hooks/use-edit-batch-action-rps', () => ({
  __esModule: true,
  default: () => ({ editRps: mockEditRps, isPending: false }),
}));

jest.mock(
  '../../domain-batch-actions-editable-value/domain-batch-actions-editable-value',
  () =>
    function MockEditableValue({ value, editable, onEdit }: any) {
      return (
        <div>
          <span>value: {value ?? '—'}</span>
          {editable && <button onClick={onEdit}>Edit</button>}
        </div>
      );
    }
);

jest.mock(
  '../../domain-batch-actions-edit-rps-modal/domain-batch-actions-edit-rps-modal',
  () =>
    function MockEditRpsModal({ isOpen, onSubmit, onClose }: any) {
      if (!isOpen) return null;
      return (
        <div>
          <span>mock-edit-rps-modal</span>
          <button onClick={() => onSubmit(250)}>mock-save</button>
          <button onClick={onClose}>mock-close</button>
        </div>
      );
    }
);

const RUNNING_ACTION: BatchAction = {
  runId: '9',
  status: 'RUNNING',
  actionType: 'cancel',
  rps: 100,
};

describe(DomainBatchActionRpsValue.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the rps value', () => {
    setup({ batchAction: RUNNING_ACTION });

    expect(screen.getByText('value: 100')).toBeInTheDocument();
  });

  it('shows the Edit button only when the action is running', () => {
    setup({
      batchAction: { runId: '2', status: 'COMPLETED', rps: 100 },
    });

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('opens the edit modal when Edit is clicked', async () => {
    const { user } = setup({ batchAction: RUNNING_ACTION });

    expect(screen.queryByText('mock-edit-rps-modal')).not.toBeInTheDocument();

    await user.click(screen.getByText('Edit'));

    expect(screen.getByText('mock-edit-rps-modal')).toBeInTheDocument();
  });

  it('submits the new rps through the edit hook', async () => {
    const { user } = setup({ batchAction: RUNNING_ACTION });

    await user.click(screen.getByText('Edit'));
    await user.click(screen.getByText('mock-save'));

    expect(mockEditRps).toHaveBeenCalledWith(250);
  });
});

function setup(props: Partial<Props> = {}) {
  const user = userEvent.setup();
  render(
    <DomainBatchActionRpsValue
      domain="domain1"
      cluster="cluster1"
      workflowId="workflow1"
      batchAction={RUNNING_ACTION}
      {...props}
    />
  );
  return { user };
}
