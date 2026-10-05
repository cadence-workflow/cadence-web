import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainPageActionsDropdown from '../domain-page-actions-dropdown';
import type {
  DomainPageActionConfig,
  Props,
} from '../domain-page-actions-dropdown.types';

jest.mock('../../config/domain-page-actions.config', () => {
  return {
    __esModule: true,
    default: [
      {
        id: 'start-workflow',
        label: 'Start new workflow',
        icon: () => <div>Mock icon</div>,
        actionButton: ({ label }) => <button>{label}</button>,
      },
      {
        id: 'batch-workflow-actions',
        label: 'Batch workflow actions',
        icon: () => <div>Mock icon</div>,
        actionButton: ({ label }) => <button>{label}</button>,
      },
    ] satisfies Array<DomainPageActionConfig>,
  };
});

describe(DomainPageActionsDropdown.name, () => {
  const defaultProps: Props = {
    domain: 'test-domain',
    cluster: 'test-cluster',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the domain actions trigger button', () => {
    setup(defaultProps);

    expect(
      screen.getByRole('button', { name: 'Domain actions' })
    ).toBeInTheDocument();
  });

  it('renders each configured action in the popover menu', async () => {
    const { user } = setup(defaultProps);

    await user.click(screen.getByRole('button', { name: 'Domain actions' }));

    expect(screen.getByText('Start new workflow')).toBeInTheDocument();
    expect(screen.getByText('Batch workflow actions')).toBeInTheDocument();
  });
});

function setup(props: Props) {
  const user = userEvent.setup();
  const renderResult = render(<DomainPageActionsDropdown {...props} />);

  return {
    user,
    ...renderResult,
  };
}
