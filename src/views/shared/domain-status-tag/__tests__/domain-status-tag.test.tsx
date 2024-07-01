import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import DomainStatusTag from '../domain-status-tag';
import { type DomainStatus } from '../domain-status-tag.types';

describe('WorkflowStatusTag', () => {
  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const tests: Array<{
    name: string;
    text: string;
    domainStatus: DomainStatus;
  }> = [
    {
      name: 'should render Registered correctly',
      text: 'Registered',
      domainStatus: 'DOMAIN_STATUS_REGISTERED',
    },
    {
      name: 'should render Deprecated correctly',
      text: 'Deprecated',
      domainStatus: 'DOMAIN_STATUS_DEPRECATED',
    },
    {
      name: 'should render Deleted correctly',
      text: 'Deleted',
      domainStatus: 'DOMAIN_STATUS_DELETED',
    },
    {
      name: 'should render Invalid correctly',
      text: 'Invalid',
      domainStatus: 'DOMAIN_STATUS_INVALID',
    },
  ];

  tests.forEach((test) => {
    it(test.name, () => {
      render(<DomainStatusTag status={test.domainStatus} />);

      const tag = screen.getByText(test.text);
      expect(tag).toBeInTheDocument();
    });
  });
});
