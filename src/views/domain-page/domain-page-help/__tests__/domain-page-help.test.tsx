import { Suspense, useState } from 'react';

import { type StatefulPopoverProps } from 'baseui/popover';
import { HttpResponse } from 'msw';
import { ErrorBoundary } from 'react-error-boundary';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';

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
  it('renders the help button and popover when feature flag is enabled', async () => {
    const { user } = await setup({ isExtendedMetadataEnabled: true });

    const helpButton = await screen.findByText('Help');
    expect(helpButton).toBeInTheDocument();

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('popover'));

    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    const helpItems = screen.getAllByTestId('help-item');
    expect(helpItems).toHaveLength(3);

    expect(screen.getByText('Get started (docs)')).toBeInTheDocument();
    expect(screen.getByText('Domain commands')).toBeInTheDocument();
    expect(screen.getByText('Custom action')).toBeInTheDocument();
  });

  it('does not render when feature flag is disabled', async () => {
    await setup({ isExtendedMetadataEnabled: false });

    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    expect(screen.queryByTestId('popover')).not.toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    await setup({ error: true });

    expect(
      await screen.findByText('Error loading help menu')
    ).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    expect(screen.queryByTestId('popover')).not.toBeInTheDocument();
  });
});

async function setup({
  isExtendedMetadataEnabled = false,
  error = false,
}: {
  isExtendedMetadataEnabled?: boolean;
  error?: boolean;
}) {
  const user = userEvent.setup();

  const result = render(
    <ErrorBoundary fallback={<div>Error loading help menu</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DomainPageHelp />
      </Suspense>
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch feature flag' },
                { status: 500 }
              );
            }

            return HttpResponse.json({
              metadata: isExtendedMetadataEnabled,
              issues: false,
            } satisfies GetConfigResponse<'EXTENDED_DOMAIN_INFO_ENABLED'>);
          },
        },
      ],
    }
  );

  return { user, ...result };
}
