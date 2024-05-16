import React from 'react';
import { render, screen } from '@/test-utils/rtl';

import DomainPageHeaderInfoItem from '../domain-page-header-info-item';

describe(DomainPageHeaderInfoItem.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render text content correctly', () => {
    render(
      <DomainPageHeaderInfoItem
        loading={false}
        title="Test title"
        content="Test content"
        placeholderSize="64px"
      />
    );

    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('Should render React Node content correctly', () => {
    const mockContent = <div data-testid="mock-content-id" />;
    render(
      <DomainPageHeaderInfoItem
        loading={false}
        title="Test title"
        content={mockContent}
        placeholderSize="64px"
      />
    );

    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-content-id')).toBeInTheDocument();
  });

  it('Should render loading state correctly', () => {
    const { container } = render(
      <DomainPageHeaderInfoItem
        loading={true}
        title="Test title"
        placeholderSize="64px"
      />
    );

    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(container.querySelector('[testid="loader"]')).not.toBeNull();
  });
});
