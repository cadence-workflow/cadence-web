import React from 'react';

import { render, screen, within } from '@/test-utils/rtl';

import { mockWorkflowHistoryDetailsEntries } from '../../__fixtures__/mock-workflow-history-details-entries';
import { workflowPageUrlParams } from '../../__fixtures__/workflow-page-url-params';
import WorkflowHistoryEventDetailsGroup from '../workflow-history-event-details-group';

jest.mock('../helpers/get-details-field-label', () =>
  jest.fn().mockImplementation(({ label }) => label)
);

jest.mock(
  '../../workflow-history-event-details-entry/workflow-history-event-details-entry',
  () =>
    jest.fn(({ entryValue, isNegative }) => (
      <div>{`${String(entryValue)}${isNegative ? '-negative' : ''}`}</div>
    ))
);

describe(WorkflowHistoryEventDetailsGroup.name, () => {
  it('renders without crashing', () => {
    render(
      <WorkflowHistoryEventDetailsGroup
        entries={mockWorkflowHistoryDetailsEntries}
        decodedPageUrlParams={workflowPageUrlParams}
      />
    );
  });

  it('renders the correct number of divs', () => {
    render(
      <WorkflowHistoryEventDetailsGroup
        entries={mockWorkflowHistoryDetailsEntries}
        decodedPageUrlParams={workflowPageUrlParams}
      />
    );

    const detailsRows = screen.getAllByTestId('details-row');
    // The mock details object has 10 key-value pairs in total, including children
    expect(detailsRows).toHaveLength(10);
  });

  it('stops recursion if an object has a value component defined in its render config', () => {
    render(
      <WorkflowHistoryEventDetailsGroup
        entries={mockWorkflowHistoryDetailsEntries}
        decodedPageUrlParams={workflowPageUrlParams}
      />
    );

    const detailsRows = screen.getAllByTestId('details-row');

    const firstDate = detailsRows[3];
    expect(
      within(firstDate).getByText(/Mon Oct 14 2024 12:34:18/)
    ).toBeDefined();

    const secondDate = detailsRows[9];
    expect(
      within(secondDate).getByText(/Mon Oct 14 2024 11:34:18/)
    ).toBeDefined();
  });

  it('renders nested details correctly', () => {
    render(
      <WorkflowHistoryEventDetailsGroup
        entries={mockWorkflowHistoryDetailsEntries}
        decodedPageUrlParams={workflowPageUrlParams}
      />
    );

    const detailsRows = screen.getAllByTestId('details-row');

    const headerSubRows = within(detailsRows[4]).getAllByTestId('details-row');
    expect(headerSubRows).toHaveLength(5);

    const field3SubRows = within(headerSubRows[2]).getAllByTestId(
      'details-row'
    );
    expect(field3SubRows).toHaveLength(2);
  });

  it('passes isNegative prop to WorkflowHistoryEventDetailsEntry when entry has isNegative property', () => {
    render(
      <WorkflowHistoryEventDetailsGroup
        entries={[
          {
            key: 'error',
            path: 'error',
            isGroup: false,
            isNegative: true,
            value: 'error value',
            renderConfig: null,
          },
        ]}
        decodedPageUrlParams={workflowPageUrlParams}
      />
    );

    // The mock component should receive the isNegative prop
    expect(screen.getByText('error value-negative')).toBeInTheDocument();
  });
});
