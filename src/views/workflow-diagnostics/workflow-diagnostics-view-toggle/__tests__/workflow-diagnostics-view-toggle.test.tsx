import { render, screen, userEvent, within } from '@/test-utils/rtl';

import WorkflowDiagnosticsViewToggle from '../workflow-diagnostics-view-toggle';
import { type DiagnosticsViewMode } from '../workflow-diagnostics-view-toggle.types';

describe(WorkflowDiagnosticsViewToggle.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with list enabled and allows switching', async () => {
    const mockSetActiveView = jest.fn();
    const { user } = setup({
      listEnabled: true,
      activeView: 'list',
      setActiveView: mockSetActiveView,
    });

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const listboxOptions = within(listbox).getAllByRole('option');
    expect(listboxOptions).toHaveLength(2);
    expect(listboxOptions[0]).not.toBeDisabled();
    expect(listboxOptions[1]).not.toBeDisabled();

    // Test switching to JSON
    const jsonButton = screen.getByText('JSON');
    await user.click(jsonButton);

    expect(mockSetActiveView).toHaveBeenCalledWith('json');
  });

  it('renders with list disabled and JSON active when list is disabled', () => {
    setup({ listEnabled: false });

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const listboxOptions = within(listbox).getAllByRole('option');
    expect(listboxOptions).toHaveLength(2);
    expect(listboxOptions[0]).toBeDisabled();
    expect(listboxOptions[1]).not.toBeDisabled();
  });
});

function setup(props: {
  listEnabled: boolean;
  activeView?: DiagnosticsViewMode;
  setActiveView?: (view: DiagnosticsViewMode) => void;
}) {
  const user = userEvent.setup();
  const renderResult = render(
    <WorkflowDiagnosticsViewToggle {...(props as any)} />
  );
  return { user, ...renderResult };
}
