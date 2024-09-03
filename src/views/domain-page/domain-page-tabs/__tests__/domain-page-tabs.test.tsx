import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import { type PageTab } from '@/components/page-tabs/page-tabs.types';

import domainPageTabsConfig from '../../config/domain-page-tabs.config';
import DomainPageTabs from '../domain-page-tabs';

const mockPushFn = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockPushFn,
    back: () => {},
    replace: () => {},
    forward: () => {},
    prefetch: () => {},
    refresh: () => {},
  }),
  useParams: () => ({
    domain: 'mock-domain',
    cluster: 'cluster_1',
    domainTab: 'workflows',
  }),
}));

jest.mock('../../config/domain-page-tabs.config', () => [
  {
    key: 'workflows',
    title: 'Workflows',
    artwork: () => <div data-testid="workflows-artwork" />,
  },
  {
    key: 'page-2',
    title: 'Page 2',
  },
]);

describe('DomainPageTabs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tabs titles correctly', () => {
    render(<DomainPageTabs />);

    domainPageTabsConfig.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('reroutes when new tab is clicked', () => {
    render(<DomainPageTabs />);

    const page2Tab = screen.getByText('Page 2');
    act(() => {
      fireEvent.click(page2Tab);
    });

    expect(mockPushFn).toHaveBeenCalledWith('page-2');
  });

  it('retains query params when new tab is clicked', () => {
    // TODO: this is a bit hacky, see if there is a better way to mock the window search property
    const originalWindow = window;
    window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        search: '?queryParam1=one&queryParam2=two',
      },
      writable: true,
    });

    render(<DomainPageTabs />);

    const page2Tab = screen.getByText('Page 2');
    act(() => {
      fireEvent.click(page2Tab);
    });

    expect(mockPushFn).toHaveBeenCalledWith(
      'page-2?queryParam1=one&queryParam2=two'
    );

    window = originalWindow;
  });

  it('renders tabs artworks correctly', () => {
    render(<DomainPageTabs />);

    domainPageTabsConfig.forEach(({ key, artwork }: PageTab) => {
      if (typeof artwork !== 'undefined')
        expect(screen.getByTestId(`${key}-artwork`)).toBeInTheDocument();
      else
        expect(screen.queryByTestId(`${key}-artwork`)).not.toBeInTheDocument();
    });
  });
});
