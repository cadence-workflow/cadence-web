import React from 'react';
import { render } from '@/test-utils/rtl';
import PageSection from '../page-section';

describe('PageSection', () => {
  it('should use section tag by default', () => {
    const { getByRole } = render(
      <PageSection aria-label="test label">Test Content</PageSection>
    );
    const sectionElement = getByRole('region', { name: 'test label' });
    expect(sectionElement).toBeInTheDocument();
    expect(sectionElement.tagName).toBe('SECTION');
  });
  it('renders with custom element', () => {
    const { getByRole } = render(
      <PageSection as="nav">Test Content</PageSection>
    );
    const sectionElement = getByRole('navigation', { name: '' });
    expect(sectionElement).toBeInTheDocument();
    expect(sectionElement.tagName).toBe('NAV');
  });
  it('renders provided children', () => {
    const { getByText } = render(
      <PageSection as="menu">Test menu</PageSection>
    );
    const sectionElement = getByText('Test menu');
    expect(sectionElement).toBeInTheDocument();
  });
});
