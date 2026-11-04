import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainWorkflowsArchivalLookup from '../domain-workflows-archival-lookup';

const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe(DomainWorkflowsArchivalLookup.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the panel with the expected fields', async () => {
    setup();

    expect(
      screen.getByText('View a specific archived workflow')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter workflow ID')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter run ID')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'View workflow' })
    ).toBeInTheDocument();
  });

  it('shows validation errors when submitting an empty form', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: 'View workflow' }));

    expect(
      await screen.findByText('Workflow ID is required')
    ).toBeInTheDocument();
    expect(await screen.findByText('Run ID is required')).toBeInTheDocument();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('navigates to the workflow page when submitting valid values', async () => {
    const { user } = setup();

    await user.type(
      screen.getByPlaceholderText('Enter workflow ID'),
      'mock-workflow-id'
    );
    await user.type(screen.getByPlaceholderText('Enter run ID'), 'mock-run-id');
    await user.click(screen.getByRole('button', { name: 'View workflow' }));

    expect(mockRouterPush).toHaveBeenCalledWith(
      '/domains/mock-domain/mock-cluster/workflows/mock-workflow-id/mock-run-id'
    );
  });
});

function setup() {
  const user = userEvent.setup();
  render(
    <DomainWorkflowsArchivalLookup
      domain="mock-domain"
      cluster="mock-cluster"
    />
  );
  return { user };
}
