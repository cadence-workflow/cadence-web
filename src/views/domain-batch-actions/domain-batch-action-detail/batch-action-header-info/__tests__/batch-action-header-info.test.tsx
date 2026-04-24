import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { type BatchAction } from '../../../domain-batch-actions.types';
import BatchActionHeaderInfo from '../batch-action-header-info';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdCheckCircle: () => <div>Check Icon</div>,
  MdOutlineCancel: () => <div>Cancel Icon</div>,
  MdWarning: () => <div>Warning Icon</div>,
  MdEdit: () => <div>Edit Icon</div>,
}));

jest.mock('baseui/spinner', () => ({
  Spinner: () => <div>Spinner</div>,
}));

const MOCK_RUNNING_ACTION: BatchAction = {
  id: '5',
  status: 'running',
  progress: 60,
  actionType: 'cancel',
  startTime: new Date('2024-03-13T08:28:50.000Z').getTime(),
  rps: 200,
  concurrency: 10,
};

describe(BatchActionHeaderInfo.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all field titles', () => {
    render(<BatchActionHeaderInfo batchAction={MOCK_RUNNING_ACTION} />);

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Started')).toBeInTheDocument();
    expect(screen.queryByText('Ended')).not.toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('RPS')).toBeInTheDocument();
    expect(screen.getByText('Concurrency')).toBeInTheDocument();
  });

  it('shows Ended field for completed actions', () => {
    const action: BatchAction = {
      id: '4',
      status: 'completed',
      actionType: 'cancel',
      endTime: new Date('2024-03-13T09:00:00.000Z').getTime(),
    };
    render(<BatchActionHeaderInfo batchAction={action} />);

    expect(screen.getByText('Ended')).toBeInTheDocument();
  });

  it('renders Processing badge with spinner for running status', () => {
    render(<BatchActionHeaderInfo batchAction={MOCK_RUNNING_ACTION} />);

    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });

  it('renders Completed badge with check icon for completed status', () => {
    const action: BatchAction = {
      id: '4',
      status: 'completed',
      actionType: 'cancel',
    };
    render(<BatchActionHeaderInfo batchAction={action} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Check Icon')).toBeInTheDocument();
  });

  it('renders Aborted badge with cancel icon for aborted status', () => {
    const action: BatchAction = {
      id: '1',
      status: 'aborted',
      actionType: 'cancel',
    };
    render(<BatchActionHeaderInfo batchAction={action} />);

    expect(screen.getByText('Aborted')).toBeInTheDocument();
    expect(screen.getByText('Cancel Icon')).toBeInTheDocument();
  });

  it('renders Failed badge with warning icon for failed status', () => {
    const action: BatchAction = {
      id: '2',
      status: 'failed',
      actionType: 'cancel',
    };
    render(<BatchActionHeaderInfo batchAction={action} />);

    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Warning Icon')).toBeInTheDocument();
  });

  it('renders capitalized action type', () => {
    render(<BatchActionHeaderInfo batchAction={MOCK_RUNNING_ACTION} />);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders rps and concurrency values with Edit buttons', () => {
    render(<BatchActionHeaderInfo batchAction={MOCK_RUNNING_ACTION} />);

    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText('Edit')).toHaveLength(2);
  });

  it('renders dashes when optional fields are missing', () => {
    const action: BatchAction = {
      id: '2',
      status: 'completed',
      actionType: 'cancel',
    };
    render(<BatchActionHeaderInfo batchAction={action} />);

    expect(screen.getAllByText('—')).toHaveLength(5); // startTime, ended, duration, rps, concurrency
  });
});
