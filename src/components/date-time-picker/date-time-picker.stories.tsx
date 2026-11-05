import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import dayjs from '@/utils/datetime/dayjs';

import DateTimePicker from './date-time-picker';
import {
  DATE_TIME_FORMAT_MINUTES,
  DATE_TIME_FORMAT_SECONDS,
} from './date-time-picker.constants';
import { type Props } from './date-time-picker.types';

function toDate(value: Date | number | undefined): Date | undefined {
  if (value == null) return undefined;
  return value instanceof Date ? value : new Date(value);
}

function StatefulDateTimePicker(args: Props) {
  const [value, setValue] = useState(args.value);

  useEffect(() => {
    setValue(args.value);
  }, [args.value]);

  return (
    <DateTimePicker
      {...args}
      minDate={toDate(args.minDate as Date | number | undefined)}
      maxDate={toDate(args.maxDate as Date | number | undefined)}
      value={value}
      onChange={(next) => {
        setValue(next);
        args.onChange(next);
      }}
    />
  );
}

const meta = {
  title: 'Components/DateTimePicker',
  component: DateTimePicker,
  parameters: {
    // centered clips the calendar under the preview edge
    layout: 'padded',
    docs: {
      story: {
        height: '520px',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    'aria-label': 'When',
    value: undefined,
    onChange: fn(),
    displayFormat: DATE_TIME_FORMAT_MINUTES,
    clearable: true,
    disabled: false,
    error: false,
    size: 'compact',
  },
  argTypes: {
    displayFormat: {
      control: 'select',
      options: [DATE_TIME_FORMAT_MINUTES, DATE_TIME_FORMAT_SECONDS],
    },
    size: {
      control: 'select',
      options: ['mini', 'compact', 'default', 'large'],
    },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: 280, minHeight: 520 }}>
        <Story />
      </div>
    ),
  ],
  render: (args: Props) => <StatefulDateTimePicker {...args} />,
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SecondsFormat: Story = {
  args: {
    value: '2024-06-15T14:30:45.000Z',
    displayFormat: DATE_TIME_FORMAT_SECONDS,
  },
};

export const BoundedRange: Story = {
  render: function BoundedRangeRender(args: Props) {
    const minDate = new Date();
    const maxDate = dayjs(minDate).add(5, 'day').toDate();
    return (
      <StatefulDateTimePicker {...args} minDate={minDate} maxDate={maxDate} />
    );
  },
};

export const Disabled: Story = {
  args: {
    value: '2024-06-15T14:30:00.000Z',
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    value: '2024-06-15T14:30:00.000Z',
    error: true,
  },
};

export const NotClearable: Story = {
  args: {
    value: '2024-06-15T14:30:00.000Z',
    clearable: false,
  },
};
