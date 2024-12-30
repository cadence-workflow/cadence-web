import React from 'react';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import DomainWorkflowsQueryLabel from '../workflows-query-label';
import { type WorkflowsQueryTooltipConfig } from '../workflows-query-label.types';

jest.mock('@/components/copy-text-button/copy-text-button', () =>
  jest.fn(({ textToCopy }) => <div>Copy Button: {textToCopy}</div>)
);

jest.mock(
  '../../config/workflows-query-tooltip.config',
  () =>
    ({
      title: 'Mock queries title',
      subtitle: 'Mock queries subtitle',
      supportedOperators: ['AND', 'OR', '='],
      docsCta: 'Mock docs CTA',
      exampleQueriesTitle: 'Examples',
      exampleQueries: [
        {
          label: 'Mock query',
          text: 'mock_query',
        },
      ],
      docsButtonText: 'Mock docs button',
      docsLink: 'https://mock.docs-button.link',
    }) satisfies WorkflowsQueryTooltipConfig
);

describe(DomainWorkflowsQueryLabel.name, () => {
  it('renders label with info icon', () => {
    render(<DomainWorkflowsQueryLabel />);

    expect(screen.getByText('Query')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-hover-target')).toBeInTheDocument();
  });

  it('renders tooltip content when info icon is hovered on', async () => {
    const user = userEvent.setup();
    render(<DomainWorkflowsQueryLabel />);

    const hoverTarget = await screen.findByTestId('tooltip-hover-target');

    await user.hover(hoverTarget);

    const tooltipTitle = await screen.findByText('Mock queries title');
    expect(tooltipTitle).toBeInTheDocument();
    expect(
      await screen.findByText('Mock queries subtitle')
    ).toBeInTheDocument();

    expect(await screen.findByText('AND')).toBeInTheDocument();
    expect(await screen.findByText('OR')).toBeInTheDocument();
    expect(await screen.findByText('=')).toBeInTheDocument();

    expect(await screen.findByText('Mock docs CTA')).toBeInTheDocument();

    expect(await screen.findByText('Examples')).toBeInTheDocument();
    expect(await screen.findByText('Mock query')).toBeInTheDocument();
    expect(await screen.findByText('mock_query')).toBeInTheDocument();
    expect(
      await screen.findByText('Copy Button: mock_query')
    ).toBeInTheDocument();

    const docsButton = await screen.findByText('Mock docs button');
    expect(docsButton).toBeInTheDocument();
    expect(docsButton).toHaveAttribute('href', 'https://mock.docs-button.link');

    await user.unhover(hoverTarget);
    await waitFor(() => expect(tooltipTitle).not.toBeInTheDocument());
  });
});
