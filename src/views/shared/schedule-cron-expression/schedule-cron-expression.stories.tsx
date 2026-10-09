import type { Meta, StoryObj } from '@storybook/nextjs';

import ScheduleCronExpression from './schedule-cron-expression';

const meta = {
  title: 'Views/Shared/ScheduleCronExpression',
  component: ScheduleCronExpression,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    cronExpression: '0 17 * * 0',
  },
} satisfies Meta<typeof ScheduleCronExpression>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hourly: Story = {
  args: {
    cronExpression: '0 * * * *',
  },
};

export const WithTimezone: Story = {
  args: {
    cronExpression: 'CRON_TZ=America/New_York 30 1 * * *',
  },
};

export const Complex: Story = {
  args: {
    cronExpression: '*/15 9-17 * * 1-5',
  },
};

export const Invalid: Story = {
  args: {
    cronExpression: 'invalid-cron',
  },
};

export const NarrowContainer: Story = {
  args: {
    cronExpression: 'CRON_TZ=America/Los_Angeles 0 8,12,18 1,15 * *',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 240 }}>
        <Story />
      </div>
    ),
  ],
};
