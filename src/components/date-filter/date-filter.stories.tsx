import type { Meta, StoryObj } from '@storybook/nextjs';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import DateFilter from './date-filter';
import { type DateFilterRange, type Props } from './date-filter.types';

const meta = {
  title: 'Components/DateFilter',
  component: DateFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    label: 'Time range',
    placeholder: 'Select time range',
    dates: { start: undefined, end: undefined },
    onChangeDates: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: 280, minHeight: 520 }}>
        <Story />
      </div>
    ),
  ],
  render: function Render(args: Props) {
    const [{ dates }, updateArgs] = useArgs<Props>();

    return (
      <DateFilter
        {...args}
        dates={dates}
        onChangeDates={(next: DateFilterRange) => {
          args.onChangeDates(next);
          updateArgs({ dates: next });
        }}
      />
    );
  },
} satisfies Meta<typeof DateFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const RelativeRange: Story = {
  args: {
    dates: { start: 'now-1h', end: 'now' },
  },
};

export const CustomRange: Story = {
  args: {
    dates: {
      start: new Date('2023-05-23T00:00:00.000Z'),
      end: new Date('2023-05-24T12:30:00.000Z'),
    },
  },
};
