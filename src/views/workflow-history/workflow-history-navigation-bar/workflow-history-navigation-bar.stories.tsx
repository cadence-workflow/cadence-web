import type { Meta, StoryObj } from '@storybook/nextjs';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import { type NavigationBarEventsMenuItem } from '../workflow-history-navigation-bar-events-menu/workflow-history-navigation-bar-events-menu.types';

import WorkflowHistoryNavigationBar from './workflow-history-navigation-bar';
import { type Props } from './workflow-history-navigation-bar.types';

const failedEventsMenuItems: Array<NavigationBarEventsMenuItem> = [
  {
    eventId: '12',
    label: 'Activity 0: helloWorldActivity',
    category: 'ACTIVITY',
  },
  { eventId: '18', label: 'Decision Task', category: 'DECISION' },
];

const pendingEventsMenuItems: Array<NavigationBarEventsMenuItem> = [
  { eventId: '24', label: 'Timer 1 (5m)', category: 'TIMER' },
];

const diagnosticsMenuItems: Array<NavigationBarEventsMenuItem> = [
  {
    eventId: '1',
    label: 'Workflow Execution Started',
    category: 'WORKFLOW',
    subItems: [
      { id: 'Workflow Timed Out.0', eventId: '1', label: 'Workflow Timed Out' },
    ],
  },
  {
    eventId: '12',
    label: 'Activity 0: helloWorldActivity',
    category: 'ACTIVITY',
    subItems: [
      { id: 'Activity Failed.1', eventId: '12', label: 'Activity Failed' },
      {
        id: 'Activity Timed Out.2',
        eventId: '14',
        label: 'Activity Timed Out',
      },
    ],
  },
  {
    eventId: '18',
    label: 'Decision Task',
    category: 'DECISION',
    subItems: [
      { id: 'Decision Failed.3', eventId: '18', label: 'Decision Failed' },
    ],
  },
];

const manyDiagnosticsMenuItems: Array<NavigationBarEventsMenuItem> = Array.from(
  { length: 14 },
  (_, index) => {
    const eventId = String(10 + index * 6);
    return {
      eventId,
      label: `Activity ${index}: processBatchActivity`,
      category: 'ACTIVITY',
      subItems: [
        {
          id: `Activity Failed.${index}`,
          eventId,
          label: 'Activity Failed',
        },
      ],
    };
  }
);

const meta = {
  title: 'Views/WorkflowHistory/WorkflowHistoryNavigationBar',
  component: WorkflowHistoryNavigationBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    failedEventsMenuItems: { control: 'object' },
    pendingEventsMenuItems: { control: 'object' },
    diagnosticsMenuItems: { control: 'object' },
  },
  args: {
    onScrollUp: fn(),
    onScrollDown: fn(),
    areAllItemsExpanded: false,
    onToggleAllItemsExpanded: fn(),
    isUngroupedView: false,
    failedEventsMenuItems: [],
    pendingEventsMenuItems: [],
    diagnosticsMenuItems: [],
    onClickEvent: fn(),
    onClickDiagnosticsIssue: fn(),
  },
  decorators: [
    (Story) => (
      // transform contains the fixed-position nav bar, so each story on the docs page keeps its own bar
      <div style={{ height: 240, transform: 'translateZ(0)' }}>
        <Story />
      </div>
    ),
  ],
  render: function Render(args: Props) {
    const [{ areAllItemsExpanded }, updateArgs] = useArgs<Props>();

    return (
      <WorkflowHistoryNavigationBar
        {...args}
        areAllItemsExpanded={areAllItemsExpanded}
        onToggleAllItemsExpanded={() => {
          args.onToggleAllItemsExpanded();
          updateArgs({ areAllItemsExpanded: !areAllItemsExpanded });
        }}
      />
    );
  },
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDiagnosticsIssues: Story = {
  args: {
    diagnosticsMenuItems,
  },
};

export const WithSingleDiagnosticsIssue: Story = {
  args: {
    diagnosticsMenuItems: [diagnosticsMenuItems[2]],
  },
};

export const WithManyDiagnosticsGroups: Story = {
  args: {
    diagnosticsMenuItems: manyDiagnosticsMenuItems,
  },
};

export const WithAllMenus: Story = {
  args: {
    failedEventsMenuItems,
    pendingEventsMenuItems,
    diagnosticsMenuItems,
  },
};

export const UngroupedView: Story = {
  args: {
    isUngroupedView: true,
    failedEventsMenuItems,
    pendingEventsMenuItems,
    diagnosticsMenuItems,
  },
};
