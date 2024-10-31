import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryExpandAllEventsButton from '../workflow-history-expand-all-events-button';
import { type Props } from '../workflow-history-expand-all-events-button.types';

jest.mock('react-icons/md', () => ({
  MdUnfoldLess: () => 'collapse-icon',
  MdUnfoldMore: () => 'expand-icon',
}));

describe('WorkflowHistoryExpandAllEventsButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Expand all" label and icon when isExpandAllEvents is false', () => {
    setup({ isExpandAllEvents: false });

    expect(
      screen.getByRole('button', { name: /Expand all/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Expand all')).toBeInTheDocument();
    expect(screen.getByText('expand-icon')).toBeInTheDocument();
  });

  it('renders "Collapse all" label and icon when isExpandAllEvents is true', () => {
    setup({});

    expect(
      screen.getByRole('button', { name: /Collapse all/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Collapse all')).toBeInTheDocument();
    expect(screen.getByText('collapse-icon')).toBeInTheDocument();
  });

  it('calls toggleIsExpandAllEvents when the button is clicked', async () => {
    const { mockedToggleExpandAllEvents, user } = setup({
      isExpandAllEvents: false,
    });

    const button = screen.getByRole('button', { name: /Expand all/i });
    await user.click(button);

    expect(mockedToggleExpandAllEvents).toHaveBeenCalledTimes(1);
  });
});

function setup({
  isExpandAllEvents = true,
}: Partial<Pick<Props, 'isExpandAllEvents'>>) {
  const user = userEvent.setup();

  const mockedToggleExpandAllEvents = jest.fn();
  const props: Props = {
    isExpandAllEvents,
    toggleIsExpandAllEvents: mockedToggleExpandAllEvents,
  };

  render(<WorkflowHistoryExpandAllEventsButton {...props} />);

  return { user, mockedToggleExpandAllEvents };
}
