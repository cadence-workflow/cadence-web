import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import ScheduleDetailsPageHeader from '../schedule-details-page-header';

describe(ScheduleDetailsPageHeader.name, () => {
  it('renders breadcrumb with domain link', () => {
    setup();

    const domainLink = screen.getByRole('link', { name: 'test-domain' });
    expect(domainLink).toBeInTheDocument();
    expect(domainLink).toHaveAttribute(
      'href',
      '/domains/test-domain/test-cluster'
    );
  });

  it('renders breadcrumb schedules list link', () => {
    setup();

    const schedulesLink = screen.getByRole('link', { name: 'Schedules' });
    expect(schedulesLink).toBeInTheDocument();
    expect(schedulesLink).toHaveAttribute(
      'href',
      '/domains/test-domain/test-cluster/schedules'
    );
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
    <ScheduleDetailsPageHeader
      domain={domain}
      cluster={cluster}
      scheduleId={scheduleId}
    />
  );
}
