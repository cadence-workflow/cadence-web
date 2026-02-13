import copy from 'copy-to-clipboard';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import WorkflowHistoryEventLinkButton from '../workflow-history-event-link-button';

jest.mock('copy-to-clipboard', jest.fn);

describe('WorkflowHistoryEventLinkButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<WorkflowHistoryEventLinkButton historyEventId="123" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAccessibleName('Copy link to event');
  });

  it('copies the current URL with event ID when clicked', async () => {
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

    const user = userEvent.setup();
    render(<WorkflowHistoryEventLinkButton historyEventId="123" />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(copy).toHaveBeenCalledWith(
      'http://localhost/domains/test-domain/workflows/test-workflow/test-run/history?he=123'
    );

    window = originalWindow;
  });

  it('shows "Copied link to event" tooltip after clicking', async () => {
    const user = userEvent.setup();
    render(<WorkflowHistoryEventLinkButton historyEventId="123" />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(await screen.findByText('Copied link to event')).toBeInTheDocument();
  });

  it('resets tooltip text when mouse leaves', async () => {
    const user = userEvent.setup();
    render(<WorkflowHistoryEventLinkButton historyEventId="123" />);
    const button = screen.getByRole('button');
    await user.click(button);

    const copiedText = await screen.findByText('Copied link to event');
    expect(copiedText).toBeInTheDocument();

    await user.unhover(button);
    await waitFor(() => {
      expect(copiedText).not.toBeInTheDocument();
    });
  });

  it('adds ungrouped view parameter when isUngroupedView is true', async () => {
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

    const user = userEvent.setup();
    render(
      <WorkflowHistoryEventLinkButton historyEventId="123" isUngroupedView />
    );
    const button = screen.getByRole('button');
    await user.click(button);
    expect(copy).toHaveBeenCalledWith(
      'http://localhost/domains/test-domain/workflows/test-workflow/test-run/history?he=123&u=true'
    );

    window = originalWindow;
  });
});
