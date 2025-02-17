import { render, fireEvent } from '@/test-utils/rtl';

import PageTabs from '../page-tabs';
import { type PageTabsList } from '../page-tabs.types';

// Mock props
const getArtwork = (number: number) =>
  function Artwork() {
    return <div>{`Artwork${number}`}</div>;
  };

const tabList: PageTabsList = [
  { key: 'tab1', title: 'Tab 1', artwork: getArtwork(1) },
  { key: 'tab2', title: 'Tab 2' },
  { key: 'tab3', title: 'Tab 3', artwork: getArtwork(3) },
  {
    key: 'tab4',
    title: 'Tab 4',
    endEnhancer: () => <div data-testid="mock-end-enhancer" />,
  },
];

const selectedTab = 'tab1';
const setSelectedTab = jest.fn();

describe('PageTabs', () => {
  it('renders tabs with correct titles and artwork', () => {
    const { getByText, queryByText } = render(
      <PageTabs
        tabList={tabList}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    );

    // Assert that all tab titles are rendered
    tabList.forEach(({ title }) => {
      expect(getByText(title)).toBeInTheDocument();
    });

    // Assert that all tab artworks are rendered
    tabList.forEach(({ artwork }, index) => {
      if (artwork) expect(getByText(`Artwork${index + 1}`)).toBeInTheDocument();
      else expect(queryByText(`Artwork${index + 1}`)).not.toBeInTheDocument();
    });
  });

  it('renders tabs with correct end enhancer', () => {
    const { getByTestId } = render(
      <PageTabs
        tabList={tabList}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    );

    expect(getByTestId('mock-end-enhancer')).toBeInTheDocument();
  });

  it('calls setSelectedTab when a tab is clicked', () => {
    const { getByText } = render(
      <PageTabs
        tabList={tabList}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    );

    // Click on the second tab
    fireEvent.click(getByText('Tab 2'));

    // Assert that setSelectedTab is called with the correct tab key
    expect(setSelectedTab).toHaveBeenCalledWith('tab2');
  });
});
