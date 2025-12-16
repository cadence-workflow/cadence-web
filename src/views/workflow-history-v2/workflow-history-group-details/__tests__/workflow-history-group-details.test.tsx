import copy from 'copy-to-clipboard';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import WorkflowHistoryGroupDetails from '../workflow-history-group-details';
import { type GroupDetailsEntries } from '../workflow-history-group-details.types';

jest.mock('copy-to-clipboard', jest.fn);

jest.mock(
  '../../workflow-history-event-details/workflow-history-event-details',
  () =>
    jest.fn(
      ({
        eventDetails,
      }: {
        eventDetails: Array<unknown>;
        workflowPageParams: WorkflowPageParams;
      }) => (
        <div aria-label="Workflow history event details">
          Event Details ({eventDetails.length} entries)
        </div>
      )
    )
);

describe(WorkflowHistoryGroupDetails.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockGroupDetails: GroupDetailsEntries = [
    [
      'event-1',
      {
        eventLabel: 'Event 1 Label',
        eventDetails: [
          {
            key: 'key1',
            path: 'path1',
            value: 'value1',
            isGroup: false,
            renderConfig: null,
          },
        ],
      },
    ],
    [
      'event-2',
      {
        eventLabel: 'Event 2 Label',
        eventDetails: [
          {
            key: 'key2',
            path: 'path2',
            value: 'value2',
            isGroup: false,
            renderConfig: null,
          },
        ],
      },
    ],
    [
      'event-3',
      {
        eventLabel: 'Event 3 Label',
        eventDetails: [
          {
            key: 'key3',
            path: 'path3',
            value: 'value3',
            isGroup: false,
            renderConfig: null,
          },
        ],
      },
    ],
  ];

  it('renders all event labels as buttons', () => {
    setup({ groupDetailsEntries: mockGroupDetails });

    expect(screen.getByText('Event 1 Label')).toBeInTheDocument();
    expect(screen.getByText('Event 2 Label')).toBeInTheDocument();
    expect(screen.getByText('Event 3 Label')).toBeInTheDocument();
  });

  it('renders WorkflowHistoryEventDetails with first event details by default', () => {
    setup({ groupDetailsEntries: mockGroupDetails });

    expect(
      screen.getByLabelText('Workflow history event details')
    ).toBeInTheDocument();
    expect(screen.getByText('Event Details (1 entries)')).toBeInTheDocument();
  });

  it('selects the event matching initialEventId', () => {
    setup({
      groupDetailsEntries: mockGroupDetails,
      initialEventId: 'event-2',
    });

    const eventDetails = screen.getByLabelText(
      'Workflow history event details'
    );
    expect(eventDetails).toBeInTheDocument();
    expect(screen.getByText('Event Details (1 entries)')).toBeInTheDocument();
  });

  it('defaults to first event when initialEventId is not provided', () => {
    setup({ groupDetailsEntries: mockGroupDetails });

    const eventDetails = screen.getByLabelText(
      'Workflow history event details'
    );
    expect(eventDetails).toBeInTheDocument();
  });

  it('defaults to first event when initialEventId is not found', () => {
    setup({
      groupDetailsEntries: mockGroupDetails,
      initialEventId: 'non-existent-event',
    });

    const eventDetails = screen.getByLabelText(
      'Workflow history event details'
    );
    expect(eventDetails).toBeInTheDocument();
  });

  it('changes selected event when a button is clicked', async () => {
    const { user } = setup({ groupDetailsEntries: mockGroupDetails });

    // Initially should show first event
    expect(screen.getByText('Event Details (1 entries)')).toBeInTheDocument();

    // Click on second event button
    const event2Button = screen.getByText('Event 2 Label');
    await user.click(event2Button);

    // Should still show event details (the mock returns same format)
    expect(
      screen.getByLabelText('Workflow history event details')
    ).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const mockOnClose = jest.fn();
    const { user } = setup({
      groupDetailsEntries: mockGroupDetails,
      onClose: mockOnClose,
    });

    const closeButton = screen.getByLabelText('Close event details');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render the close button when onClose is not provided', () => {
    setup({
      groupDetailsEntries: mockGroupDetails,
      onClose: undefined,
    });

    const closeButton = screen.queryByLabelText('Close event details');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('handles single event in groupDetails', () => {
    const singleEventGroupDetails: GroupDetailsEntries = [
      [
        'event-1',
        {
          eventLabel: 'Single Event',
          eventDetails: [
            {
              key: 'key1',
              path: 'path1',
              value: 'value1',
              isGroup: false,
              renderConfig: null,
            },
          ],
        },
      ],
    ];

    setup({ groupDetailsEntries: singleEventGroupDetails });

    expect(screen.getByText('Single Event')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Workflow history event details')
    ).toBeInTheDocument();
  });

  it('renders link button for copying event link', () => {
    setup({ groupDetailsEntries: mockGroupDetails });

    const linkButton = screen.getByLabelText('Copy link to event');
    expect(linkButton).toBeInTheDocument();
  });

  it('copies link with event ID when link button is clicked', async () => {
    // TODO: this is a bit hacky, see if there is a better way to mock the window location property
    const originalWindow = window;
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        origin: 'http://localhost',
        pathname:
          '/domains/test-domain/workflows/test-workflow/test-run/history',
      },
      writable: true,
    });

    const { user } = setup({
      groupDetailsEntries: mockGroupDetails,
      initialEventId: 'event-2',
    });

    const linkButton = screen.getByLabelText('Copy link to event');
    await user.click(linkButton);

    expect(copy).toHaveBeenCalledWith(
      'http://localhost/domains/test-domain/workflows/test-workflow/test-run/history?he=event-2'
    );

    window = originalWindow;
  });

  it('updates link when different event is selected', async () => {
    // TODO: this is a bit hacky, see if there is a better way to mock the window location property
    const originalWindow = window;
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        origin: 'http://localhost',
        pathname:
          '/domains/test-domain/workflows/test-workflow/test-run/history',
      },
      writable: true,
    });

    const { user } = setup({ groupDetailsEntries: mockGroupDetails });

    const event2Button = screen.getByText('Event 2 Label');
    await user.click(event2Button);

    const linkButton = screen.getByLabelText('Copy link to event');
    await user.click(linkButton);

    expect(copy).toHaveBeenCalledWith(
      'http://localhost/domains/test-domain/workflows/test-workflow/test-run/history?he=event-2'
    );

    window = originalWindow;
  });

  it('shows "Copied link to event" tooltip after clicking link button', async () => {
    const { user } = setup({ groupDetailsEntries: mockGroupDetails });

    const linkButton = screen.getByLabelText('Copy link to event');
    await user.click(linkButton);

    expect(await screen.findByText('Copied link to event')).toBeInTheDocument();
  });
});

function setup({
  groupDetailsEntries,
  initialEventId,
  workflowPageParams = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
  },
  onClose,
}: {
  groupDetailsEntries: GroupDetailsEntries;
  initialEventId?: string;
  workflowPageParams?: WorkflowPageParams;
  onClose?: () => void;
}) {
  const user = userEvent.setup();

  render(
    <WorkflowHistoryGroupDetails
      groupDetailsEntries={groupDetailsEntries}
      initialEventId={initialEventId}
      workflowPageParams={workflowPageParams}
      onClose={onClose}
    />
  );

  return { user };
}
