import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import SchedulePageHeader from '../schedule-page-header';

describe(SchedulePageHeader.name, () => {
  it('renders breadcrumb with domain link', () => {
    setup();

    const domainLink = screen.getByRole('link', { name: 'test-domain' });
    expect(domainLink).toBeInTheDocument();
    expect(domainLink).toHaveAttribute(
      'href',
      '/domains/test-domain/test-cluster'
    );
  });

  it('does not render a Schedules list link', () => {
    setup();

    expect(
      screen.queryByRole('link', { name: 'Schedules' })
    ).not.toBeInTheDocument();
  });

  it('renders schedule id as last breadcrumb (non-link)', () => {
    setup();

    expect(screen.getByText('my-schedule-id')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'my-schedule-id' })
    ).not.toBeInTheDocument();
  });

  it('encodes special characters in domain and cluster hrefs', () => {
    setup({ domain: 'my domain', cluster: 'my cluster' });

    expect(screen.getByRole('link', { name: 'my domain' })).toHaveAttribute(
      'href',
      '/domains/my%20domain/my%20cluster'
    );
  });
});

function setup({
  domain = 'test-domain',
  cluster = 'test-cluster',
  scheduleId = 'my-schedule-id',
}: {
  domain?: string;
  cluster?: string;
  scheduleId?: string;
} = {}) {
  render(
    <SchedulePageHeader
      domain={domain}
      cluster={cluster}
      scheduleId={scheduleId}
    />
  );
}
