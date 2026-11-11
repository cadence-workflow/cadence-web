import { useState } from 'react';

import { type StatefulPopoverProps } from 'baseui/popover';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockDomainPageHelpMenuConfig } from '../../__fixtures__/domain-page-help-menu-config';
import DomainPageHelp from '../domain-page-help';

jest.mock(
  '../../config/domain-page-help-menu.config',
  () => mockDomainPageHelpMenuConfig
);

jest.mock('baseui/popover', () => {
  const originalModule = jest.requireActual('baseui/popover');
  return {
    ...originalModule,
    StatefulPopover: ({ content, children }: StatefulPopoverProps) => {
      const [isShown, setIsShown] = useState(false);

      return (
        <div data-testid="popover" onClick={() => setIsShown(true)}>
          {children}
          {isShown ? (
            <div data-testid="popover-content">
              {typeof content !== 'function' && content}
            </div>
          ) : null}
        </div>
      );
    },
  };
});

jest.mock(
  '../../domain-page-help-item-button/domain-page-help-item-button',
  () => jest.fn(({ text }) => <div data-testid="help-item">{text}</div>)
);

describe(DomainPageHelp.name, () => {
  it('renders the help button and popover', async () => {
    const { user } = setup();

    expect(screen.getByText('Help')).toBeInTheDocument();

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('popover'));

    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    const helpItems = screen.getAllByTestId('help-item');
    expect(helpItems).toHaveLength(3);

    expect(screen.getByText('Get started (docs)')).toBeInTheDocument();
    expect(screen.getByText('Domain commands')).toBeInTheDocument();
    expect(screen.getByText('Custom action')).toBeInTheDocument();
  });
});

function setup() {
  const user = userEvent.setup();

  const result = render(<DomainPageHelp />);

  return { user, ...result };
}
