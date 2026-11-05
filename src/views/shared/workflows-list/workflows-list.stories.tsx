import { createElement, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import FormattedDate from '@/components/formatted-date/formatted-date';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import WorkflowsList from './workflows-list';
import {
  type Props,
  type SelectionParams,
  type WorkflowsListColumn,
} from './workflows-list.types';

const mockColumns: Array<WorkflowsListColumn> = [
  {
    id: 'WorkflowID',
    name: 'Workflow ID',
    width: 'minmax(150px, 3fr)',
    isSystem: true,
    renderCell: (row) => row.workflowID,
  },
  {
    id: 'CloseStatus',
    name: 'Status',
    width: '140px',
    isSystem: true,
    renderCell: (row) =>
      createElement(WorkflowStatusTag, { status: row.status }),
  },
  {
    id: 'RunID',
    name: 'Run ID',
    width: 'minmax(150px, 3fr)',
    isSystem: true,
    renderCell: (row) => row.runID,
  },
  {
    id: 'WorkflowType',
    name: 'Workflow Type',
    width: 'minmax(150px, 2fr)',
    isSystem: true,
    renderCell: (row) => row.workflowName,
  },
  {
    id: 'StartTime',
    name: 'Started',
    width: 'minmax(100px, 200px)',
    isSystem: true,
    sortable: true,
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.startTime }),
  },
];

const mockWorkflows: Array<DomainWorkflow> = [
  getMockWorkflowListItem({
    workflowID: 'order-fulfillment-a1b2',
    runID: 'run-001-aaa',
    workflowName: 'OrderFulfillmentWorkflow',
    status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    startTime: 1714500000000,
    closeTime: 1714503600000,
  }),
  getMockWorkflowListItem({
    workflowID: 'payment-retry-c3d4',
    runID: 'run-002-bbb',
    workflowName: 'PaymentRetryWorkflow',
    status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
    startTime: 1714496400000,
    closeTime: 1714498200000,
  }),
  getMockWorkflowListItem({
    workflowID: 'user-onboarding-e5f6',
    runID: 'run-003-ccc',
    workflowName: 'UserOnboardingWorkflow',
    status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    startTime: 1714510800000,
  }),
  getMockWorkflowListItem({
    workflowID: 'inventory-sync-g7h8',
    runID: 'run-004-ddd',
    workflowName: 'InventorySyncWorkflow',
    status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED',
    startTime: 1714489200000,
    closeTime: 1714491000000,
  }),
  getMockWorkflowListItem({
    workflowID: 'cron-cleanup-i9j0',
    runID: 'run-005-eee',
    workflowName: 'NightlyCleanupWorkflow',
    status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
    startTime: 1714478400000,
    closeTime: 1714482000000,
    isCron: true,
  }),
];

const manyWorkflows: Array<DomainWorkflow> = Array.from(
  { length: 20 },
  (_, index) =>
    getMockWorkflowListItem({
      workflowID: `workflow-${String(index + 1).padStart(3, '0')}`,
      runID: `run-${String(index + 1).padStart(3, '0')}`,
      workflowName: `ExampleWorkflow${index + 1}`,
      status:
        index % 3 === 0
          ? 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED'
          : index % 3 === 1
            ? 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED'
            : 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
      startTime: 1714500000000 - index * 3_600_000,
    })
);

function SelectionStory(args: Props) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);

  const workflowKey = (workflow: DomainWorkflow) =>
    `${workflow.workflowID}/${workflow.runID}`;

  const selection: SelectionParams = {
    isAllSelected,
    onToggleAll: () => {
      setIsAllSelected((prev) => {
        if (!prev) {
          setSelectedKeys(new Set());
        }
        return !prev;
      });
    },
    isSelected: (workflow) =>
      isAllSelected || selectedKeys.has(workflowKey(workflow)),
    isRowToggleDisabled: isAllSelected,
    rowToggleDisabledReason: isAllSelected
      ? 'Clear select-all to toggle individual rows'
      : undefined,
    onToggle: (workflow) => {
      const key = workflowKey(workflow);
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
  };

  return <WorkflowsList {...args} selection={selection} />;
}

function SortableStory(args: Props) {
  const [sortColumn, setSortColumn] = useState('StartTime');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  return (
    <WorkflowsList
      {...args}
      sortParams={{
        sortColumn,
        sortOrder,
        onSort: (column) => {
          args.sortParams?.onSort(column);
          if (sortColumn === column) {
            setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
          } else {
            setSortColumn(column);
            setSortOrder('DESC');
          }
        },
      }}
    />
  );
}

const meta = {
  title: 'Views/Shared/WorkflowsList',
  component: WorkflowsList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    domain: 'mock-domain',
    cluster: 'mock-cluster',
    workflows: mockWorkflows,
    columns: mockColumns,
    error: null,
    hasNextPage: false,
    fetchNextPage: fn(),
    isFetchingNextPage: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    workflows: [],
  },
};

export const WithSort: Story = {
  args: {
    sortParams: {
      onSort: fn(),
      sortColumn: 'StartTime',
      sortOrder: 'DESC',
    },
  },
  render: (args) => <SortableStory {...args} />,
};

export const WithSelection: Story = {
  render: (args) => <SelectionStory {...args} />,
};

export const WithMaxHeight: Story = {
  args: {
    workflows: manyWorkflows,
    maxHeight: '320px',
    hasNextPage: true,
  },
};

export const LoadingNextPage: Story = {
  args: {
    hasNextPage: true,
    isFetchingNextPage: true,
  },
};

export const ErrorState: Story = {
  args: {
    workflows: [],
    error: new Error('Failed to load workflows'),
    hasNextPage: true,
  },
};

export const SelectAllDisabledRows: Story = {
  args: {
    selection: {
      isAllSelected: true,
      onToggleAll: fn(),
      isSelected: () => true,
      isRowToggleDisabled: true,
      rowToggleDisabledReason: 'Clear select-all to toggle individual rows',
      onToggle: fn(),
    },
  },
};
