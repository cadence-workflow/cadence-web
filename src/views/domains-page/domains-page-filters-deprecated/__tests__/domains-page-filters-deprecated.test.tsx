import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainsPageFilterDeprecated from '../domains-page-filters-deprecated';
import { type DomainsPageFiltersDeprecatedValue } from '../domains-page-filters-deprecated.types';

describe('DomainsPageFilterDeprecated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the checkbox with correct label', () => {
    setup({ showDeprecated: false });

    expect(screen.getByText('Show deprecated domains')).toBeInTheDocument();
  });

  it('renders checkbox in unchecked state when showDeprecated is false', () => {
    setup({ showDeprecated: false });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders checkbox in checked state when showDeprecated is true', () => {
    setup({ showDeprecated: true });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls setValue with true when checkbox is checked', async () => {
    const { user, mockSetValue } = setup({ showDeprecated: false });

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockSetValue).toHaveBeenCalledWith({ showDeprecated: true });
  });

  it('calls setValue with undefined when checkbox is unchecked', async () => {
    const { user, mockSetValue } = setup({ showDeprecated: true });

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockSetValue).toHaveBeenCalledWith({ showDeprecated: undefined });
  });
});

function setup(value: DomainsPageFiltersDeprecatedValue) {
  const user = userEvent.setup();
  const mockSetValue = jest.fn();

  const renderResult = render(
    <DomainsPageFilterDeprecated value={value} setValue={mockSetValue} />
  );

  return { ...renderResult, user, mockSetValue };
}
