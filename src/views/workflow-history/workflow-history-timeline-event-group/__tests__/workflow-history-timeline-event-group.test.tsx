import { render, screen } from '@/test-utils/rtl';

import { mockActivityEventGroup } from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import * as generateHistoryGroupDetailsModule from '../../helpers/generate-history-group-details';
import type WorkflowHistoryGroupDetails from '../../workflow-history-group-details/workflow-history-group-details';
import WorkflowHistoryTimelineEventGroup from '../workflow-history-timeline-event-group';
import { type Props } from '../workflow-history-timeline-event-group.types';

jest.mock('../../helpers/generate-history-group-details', () => jest.fn());

jest.mock<typeof WorkflowHistoryGroupDetails>(
  '../../workflow-history-group-details/workflow-history-group-details',
  () =>
    jest.fn(({ groupDetailsEntries, onClose }) => (
      <div data-testid="workflow-history-group-details">
        <div data-testid="group-details-count">
          {groupDetailsEntries.length} events
        </div>
        {onClose && (
          <button onClick={onClose} data-testid="group-details-close">
            Close
          </button>
        )}
      </div>
    ))
);

describe(WorkflowHistoryTimelineEventGroup.name, () => {
  it('renders group details correctly', () => {
    setup();

    expect(
      screen.getByTestId('workflow-history-group-details')
    ).toBeInTheDocument();
    expect(screen.getByTestId('group-details-count')).toHaveTextContent(
      '1 events'
    );
  });
});

function setup(propsOverrides: Partial<Props> = {}) {
  const mockGenerateHistoryGroupDetails = jest.spyOn(
    generateHistoryGroupDetailsModule,
    'default'
  );

  mockGenerateHistoryGroupDetails.mockReturnValue({
    groupDetailsEntries: [
      ['event-1', { eventLabel: 'Event 1', eventDetails: [] }],
    ],
    summaryDetailsEntries: [],
  });

  const props: Props = {
    eventGroup: mockActivityEventGroup,
    decodedPageUrlParams: {
      domain: 'test-domain',
      cluster: 'test-cluster',
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
      workflowTab: 'history',
    },
    onClickShowInTable: jest.fn(),
    onClose: jest.fn(),
    ...propsOverrides,
  };

  render(<WorkflowHistoryTimelineEventGroup {...props} />);

  return {
    props,
  };
}
