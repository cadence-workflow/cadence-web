import React from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import {
  mockDomainPageQueryParamsValues,
  mockDateOverrides,
} from '../../__fixtures__/domain-page-query-params';
import type domainPageQueryParamsConfig from '../../config/domain-page-query-params.config';
import DomainPageWorkflowsFiltersDates from '../domain-page-workflows-filters-dates';

jest.useFakeTimers().setSystemTime(new Date('2023-05-25'));

jest.mock('../domain-page-workflows-filters-dates.constants', () => ({
  ...jest.requireActual('../domain-page-workflows-filters-dates.constants'),
  DATE_FORMAT: 'dd MMM yyyy, HH:mm x',
}));

describe('DomainPageWorkflowsFiltersDates', () => {
  it('displays the date picker component', () => {
    setup({});
    expect(
      screen.getByPlaceholderText('Select time range')
    ).toBeInTheDocument();
  });

  it('renders without errors when dates are already provided in query params', () => {
    setup({
      queryParamsOverrides: mockDateOverrides,
    });
    expect(
      // TODO - set timezone config for unit tests to UTC
      screen.getByDisplayValue(
        '23 May 2023, 00:00 +00 – 24 May 2023, 00:00 +00'
      )
    ).toBeInTheDocument();
  });

  it('sets query params when date is set', () => {
    const { mockSetQueryParams } = setup({});
    const datePicker = screen.getByPlaceholderText('Select time range');
    act(() => {
      fireEvent.change(datePicker, {
        target: { value: '13 May 2023, 00:00 +00 – 14 May 2023, 00:00 +00' },
      });
    });

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      startDate: '2023-05-13T00:00:00.000Z',
      endDate: '2023-05-14T00:00:00.000Z',
    });
  });

  it('resets to previous date when one date is selected and then the modal is closed', () => {
    const { mockSetQueryParams } = setup({
      queryParamsOverrides: mockDateOverrides,
    });
    const datePicker = screen.getByPlaceholderText('Select time range');

    act(() => {
      fireEvent.focus(datePicker);
    });

    const startDateLabel = screen.getByLabelText(
      "Choose Saturday, May 13th 2023. It's available."
    );

    act(() => {
      fireEvent.click(startDateLabel);
    });

    screen.getByText(
      'Selected date is 13 May 2023, 00:00 +00. Select the second date.'
    );

    act(() => {
      fireEvent.keyDown(datePicker, { keyCode: 9 });
    });

    expect(datePicker).toHaveValue(
      '23 May 2023, 00:00 +00 – 24 May 2023, 00:00 +00'
    );
    expect(mockSetQueryParams).not.toHaveBeenCalled();
  });

  it('resets to empty state when one date is selected and then the modal is closed', () => {
    const { mockSetQueryParams } = setup({});
    const datePicker = screen.getByPlaceholderText('Select time range');

    act(() => {
      fireEvent.focus(datePicker);
    });

    const startDateLabel = screen.getByLabelText(
      "Choose Saturday, May 13th 2023. It's available."
    );

    act(() => {
      fireEvent.click(startDateLabel);
    });

    screen.getByText(
      'Selected date is 13 May 2023, 00:00 +00. Select the second date.'
    );

    act(() => {
      fireEvent.keyDown(datePicker, { keyCode: 9 });
    });

    expect(datePicker).toHaveValue('');
    expect(mockSetQueryParams).not.toHaveBeenCalled();
  });

  it('clears the date when the clear button is clicked', () => {
    const { mockSetQueryParams } = setup({
      queryParamsOverrides: mockDateOverrides,
    });
    const clearButton = screen.getByLabelText('Clear value');
    act(() => {
      fireEvent.click(clearButton);
    });

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      startDate: undefined,
      endDate: undefined,
    });
  });
});

function setup({
  queryParamsOverrides,
}: {
  queryParamsOverrides?: Partial<
    PageQueryParamValues<typeof domainPageQueryParamsConfig>
  >;
}) {
  const mockSetQueryParams = jest.fn();
  render(
    <DomainPageWorkflowsFiltersDates
      queryParams={{
        ...mockDomainPageQueryParamsValues,
        ...queryParamsOverrides,
      }}
      setQueryParams={mockSetQueryParams}
    />
  );

  return { mockSetQueryParams };
}
