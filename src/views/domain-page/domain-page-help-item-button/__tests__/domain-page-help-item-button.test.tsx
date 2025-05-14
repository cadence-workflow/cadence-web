import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockDomainPageHelpMenuConfig } from '../../__fixtures__/domain-page-help-menu-config';
import DomainPageHelpItemButton from '../domain-page-help-item-button';

const linkItem = mockDomainPageHelpMenuConfig[0].items[0];
const modalItem = mockDomainPageHelpMenuConfig[1].items[0];
const otherItem = mockDomainPageHelpMenuConfig[2].items[0];

describe(DomainPageHelpItemButton.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a link button correctly', () => {
    render(<DomainPageHelpItemButton {...linkItem} />);

    const linkItemButton = screen.getByRole('link');
    expect(linkItemButton).toBeInTheDocument();

    expect(linkItemButton).toHaveTextContent('Get started (docs)');
    expect(linkItemButton).toHaveAttribute('target', '_blank');
    expect(linkItemButton).toHaveAttribute('rel', 'noreferrer');
    expect(linkItemButton).toHaveAttribute('href', 'https://mock.docs.link');
  });

  it('renders a modal button correctly and opens the modal on click', async () => {
    const user = userEvent.setup();
    render(<DomainPageHelpItemButton {...modalItem} />);

    const buttonElement = screen.getByText('Domain commands');
    expect(buttonElement).toBeInTheDocument();

    await user.click(buttonElement);

    expect(modalItem.modal).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        onClose: expect.any(Function),
      }),
      expect.anything()
    );
  });

  it('renders an action button correctly and calls onClick handler', async () => {
    const user = userEvent.setup();
    render(<DomainPageHelpItemButton {...otherItem} />);

    const button = screen.getByText('Custom action');
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(otherItem.onClick).toHaveBeenCalledTimes(1);
  });
});
