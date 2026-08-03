import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import DomainsPage from '../domains-page';

jest.mock(
  '../domains-page-context-provider/domains-page-context-provider',
  () =>
    function MockDomainsPageContextProvider({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return <div data-testid="domains-page-context-provider">{children}</div>;
    }
);

jest.mock(
  '../domains-page-content/domains-page-content',
  () =>
    function MockDomainsPageContent() {
      return <div data-testid="domains-page-content" />;
    }
);

describe(DomainsPage.name, () => {
  it('renders contents correctly', () => {
    render(<DomainsPage />);

    expect(
      screen.getByTestId('domains-page-context-provider')
    ).toBeInTheDocument();
    expect(screen.getByTestId('domains-page-content')).toBeInTheDocument();
  });
});
