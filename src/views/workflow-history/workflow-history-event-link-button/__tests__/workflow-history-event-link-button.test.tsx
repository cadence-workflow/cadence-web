import copy from 'copy-to-clipboard';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import WorkflowHistoryEventLinkButton from '../workflow-history-event-link-button';

jest.mock('copy-to-clipboard', jest.fn);

describe('WorkflowHistoryEventLinkButton', () => {
  let originalWindow: Window & typeof globalThis;

  beforeEach(() => {
    // Mock window.location
    originalWindow = window;
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
  });

  afterEach(() => {
    window = originalWindow;
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<WorkflowHistoryEventLinkButton historyEventId="123" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAccessibleName('Copy link to event');
  });

  it('shows tooltip with "Copy link to event" by default', async () => {
    const user = userEvent.setup();
    render(<WorkflowHistoryEventLinkButton historyEventId="123" />);
    const button = screen.getByRole('button');
    await user.hover(button);
    expect(await screen.findByText('Copy link to event')).toBeInTheDocument();
  });

  it('copies the current URL with event ID when clicked', async () => {
    const user = userEvent.setup();
    render(<WorkflowHistoryEventLinkButton historyEventId="123" />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(copy).toHaveBeenCalledWith(
      'http://localhost/domains/test-domain/workflows/test-workflow/test-run/history?he=123'
    );
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

    await user.hover(button);
    expect(await screen.findByText('Copy link to event')).toBeInTheDocument();
  });

  it('adds ungrouped view parameter when isUngroupedView is true', async () => {
    const user = userEvent.setup();
    render(
      <WorkflowHistoryEventLinkButton historyEventId="123" isUngroupedView />
    );
    const button = screen.getByRole('button');
    await user.click(button);
    expect(copy).toHaveBeenCalledWith(
      'http://localhost/domains/test-domain/workflows/test-workflow/test-run/history?he=123&u=true'
    );
  });
});
