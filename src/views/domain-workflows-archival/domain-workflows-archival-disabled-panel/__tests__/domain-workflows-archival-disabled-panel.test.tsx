import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import DomainWorkflowsArchivalDisabledPanel from '../domain-workflows-archival-disabled-panel';
import { type ArchivalDisabledPanelConfig } from '../domain-workflows-archival-disabled-panel.types';

jest.mock(
  '../../config/domain-workflows-archival-disabled-panel.config',
  () =>
    ({
      title: 'Mock archival disabled title',
      details: [
        'Mock archival disabled detail 1',
        'Mock archival disabled detail 2',
      ],
      links: [
        {
          text: 'Mock docs CTA',
          href: 'https://mock.docs.link',
        },
      ],
    }) satisfies ArchivalDisabledPanelConfig
);

describe(DomainWorkflowsArchivalDisabledPanel.name, () => {
  it('renders panel correctly', async () => {
    render(<DomainWorkflowsArchivalDisabledPanel />);

    expect(
      screen.getByText('Mock archival disabled title')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Mock archival disabled detail 1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Mock archival disabled detail 2')
    ).toBeInTheDocument();

    const docsLink = await screen.findByText('Mock docs CTA');
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute('href', 'https://mock.docs.link');
  });
});
