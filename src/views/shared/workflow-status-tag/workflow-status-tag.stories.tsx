import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';
import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

import WorkflowStatusTag from './workflow-status-tag';
import {
  WORKFLOW_STATUS_NAMES,
  WORKFLOW_STATUSES,
} from './workflow-status-tag.constants';

const StatusRow = createStyled(
  'div',
  ({ $theme }: { $theme: Theme }): StyleObject => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: $theme.sizing.scale300,
  })
);

const meta = {
  title: 'Views/Shared/WorkflowStatusTag',
  component: WorkflowStatusTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: Object.values(WORKFLOW_STATUSES),
      labels: WORKFLOW_STATUS_NAMES,
    },
    link: { control: 'text' },
    isArchived: { control: 'boolean' },
  },
  args: {
    status: WORKFLOW_STATUSES.running,
  },
} satisfies Meta<typeof WorkflowStatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  args: {
    status: WORKFLOW_STATUSES.running,
  },
};

export const Completed: Story = {
  args: {
    status: WORKFLOW_STATUSES.completed,
  },
};

export const Failed: Story = {
  args: {
    status: WORKFLOW_STATUSES.failed,
  },
};

export const TimedOut: Story = {
  args: {
    status: WORKFLOW_STATUSES.timedOut,
  },
};

export const Canceled: Story = {
  args: {
    status: WORKFLOW_STATUSES.canceled,
  },
};

export const Terminated: Story = {
  args: {
    status: WORKFLOW_STATUSES.terminated,
  },
};

export const ContinuedAsNew: Story = {
  args: {
    status: WORKFLOW_STATUSES.continuedAsNew,
  },
};

export const Archived: Story = {
  args: {
    status: WORKFLOW_STATUSES.running,
    isArchived: true,
  },
};

export const WithLink: Story = {
  args: {
    status: WORKFLOW_STATUSES.continuedAsNew,
    link: 'https://example.com/workflows/continued',
  },
};

export const AllStatuses: Story = {
  render: () => (
    <StatusRow>
      {Object.values(WORKFLOW_STATUSES).map((status) => (
        <WorkflowStatusTag key={status} status={status} />
      ))}
      <WorkflowStatusTag status={WORKFLOW_STATUSES.running} isArchived />
    </StatusRow>
  ),
};
