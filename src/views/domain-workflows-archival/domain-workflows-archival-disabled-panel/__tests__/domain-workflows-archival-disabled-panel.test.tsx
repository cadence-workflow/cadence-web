import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

import DomainWorkflowsArchivalDisabledPanel from '../domain-workflows-archival-disabled-panel';
import { type ArchivalDisabledPanelConfig } from '../domain-workflows-archival-disabled-panel.types';

const mockOnActionClick = jest.fn();

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message, description, actions }: ErrorPanelProps) => (
    <div>
      <div>{message}</div>
      <div>{description}</div>
      {actions?.map((action) => (
        <button key={action.label} onClick={() => mockOnActionClick(action)}>
          {action.label}
        </button>
      ))}
    </div>
  ))
);

jest.mock(
  '../../config/domain-workflows-archival-disabled-panel.config',
  () =>
    ({
      title: 'Mock archival disabled title',
      description: 'Mock archival disabled description',
      links: [
        {
          text: 'Mock docs CTA',
          href: 'https://mock.docs.link',
        },
      ],
    }) satisfies ArchivalDisabledPanelConfig
);

describe(DomainWorkflowsArchivalDisabledPanel.name, () => {
  beforeEach(() => {
    mockOnActionClick.mockClear();
  });

  it('renders panel correctly', async () => {
    render(<DomainWorkflowsArchivalDisabledPanel />);

    expect(
      screen.getByText('Mock archival disabled title')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Mock archival disabled description')
    ).toBeInTheDocument();

    expect(
      await screen.findByRole('button', { name: 'Mock docs CTA' })
    ).toBeInTheDocument();
  });

  it('passes an external link action for the docs CTA', async () => {
    const user = userEvent.setup();
    render(<DomainWorkflowsArchivalDisabledPanel />);

    await user.click(
      await screen.findByRole('button', { name: 'Mock docs CTA' })
    );

    expect(mockOnActionClick).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'link-external',
        label: 'Mock docs CTA',
        link: 'https://mock.docs.link',
      })
    );
  });
});
