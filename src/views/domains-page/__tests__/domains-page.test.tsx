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
  it('renders synchronously without pre-fetching any domain data', () => {
    // The page must not be an async server component blocking on data fetches
    expect(DomainsPage.constructor.name).toEqual('Function');

    render(<DomainsPage />);

    expect(
      screen.getByTestId('domains-page-context-provider')
    ).toBeInTheDocument();
    expect(screen.getByTestId('domains-page-content')).toBeInTheDocument();
  });
});
