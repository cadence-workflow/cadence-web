import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import PageFiltersToggle from '../page-filters-toggle';
import { type Props } from '../page-filters-toggle.types';

afterEach(() => {
  jest.clearAllMocks();
});

describe('PageFiltersToggle', () => {
  it('should call onClick prop on clicking the button', async () => {
    const { mockedOnClick } = setup({});

    const filtersButton = await screen.findByText('Filters');

    act(() => {
      fireEvent.click(filtersButton);
    });

    expect(mockedOnClick).toHaveBeenCalled();
  });
  it('should show filters count', async () => {
    setup({ activeFiltersCount: 2 });
    expect(screen.getByText('Filters (2)')).toBeInTheDocument();
  });
});

function setup(props: Partial<Props>) {
  const mockedOnClick = jest.fn();
  render(
    <PageFiltersToggle
      activeFiltersCount={0}
      isActive={true}
      onClick={mockedOnClick}
      {...props}
    />
  );
  return { mockedOnClick };
}
