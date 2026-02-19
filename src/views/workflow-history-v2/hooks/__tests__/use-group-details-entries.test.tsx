import { renderHook } from '@/test-utils/rtl';

import { mockActivityEventGroup } from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import * as generateHistoryGroupDetailsModule from '../../helpers/generate-history-group-details';
import type { EventDetailsTabContent } from '../../workflow-history-group-details/workflow-history-group-details.types';
import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import useGroupDetailsEntries from '../use-group-details-entries';

jest.mock('../../helpers/generate-history-group-details');

describe(useGroupDetailsEntries.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return groupDetailsEntries and summaryDetailsEntries from generateHistoryGroupDetails', () => {
    const mockGroupDetailsEntries: Array<[string, EventDetailsTabContent]> = [
      [
        'event-1',
        {
          eventLabel: 'Event 1',
          eventDetails: [
            {
              key: 'key1',
              path: 'path1',
              value: 'value1',
              isGroup: false,
              renderConfig: null,
            },
          ],
        },
      ],
      [
        'event-2',
        {
          eventLabel: 'Event 2',
          eventDetails: [
            {
              key: 'key2',
              path: 'path2',
              value: 'value2',
              isGroup: false,
              renderConfig: null,
            },
          ],
        },
      ],
    ];

    const mockSummaryDetailsEntries: Array<[string, EventDetailsTabContent]> = [
      [
        'event-1',
        {
          eventLabel: 'Event 1',
          eventDetails: [
            {
              key: 'key1',
              path: 'path1',
              value: 'value1',
              isGroup: false,
              renderConfig: null,
            },
          ],
        },
      ],
    ];

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      firstEventId: 'event-1',
    };

    const { result } = setup({
      eventGroup,
      mockGroupDetails: {
        groupDetailsEntries: mockGroupDetailsEntries,
        summaryDetailsEntries: mockSummaryDetailsEntries,
      },
    });

    expect(result.current.groupDetailsEntries).toEqual(mockGroupDetailsEntries);
    expect(result.current.summaryDetailsEntries).toEqual(
      mockSummaryDetailsEntries
    );
  });

  it('should compute groupSummaryDetails by flatMapping summaryDetailsEntries', () => {
    const mockSummaryDetailsEntries: Array<[string, EventDetailsTabContent]> = [
      [
        'event-1',
        {
          eventLabel: 'Event 1',
          eventDetails: [
            {
              key: 'key1',
              path: 'path1',
              value: 'value1',
              isGroup: false,
              renderConfig: null,
            },
            {
              key: 'key2',
              path: 'path2',
              value: 'value2',
              isGroup: false,
              renderConfig: null,
            },
          ],
        },
      ],
      [
        'event-2',
        {
          eventLabel: 'Event 2',
          eventDetails: [
            {
              key: 'key3',
              path: 'path3',
              value: 'value3',
              isGroup: false,
              renderConfig: null,
            },
          ],
        },
      ],
    ];

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      firstEventId: 'event-1',
    };

    const { result } = setup({
      eventGroup,
      mockGroupDetails: {
        groupDetailsEntries: [
          ['event-1', { eventLabel: 'Event 1', eventDetails: [] }],
          ['event-2', { eventLabel: 'Event 2', eventDetails: [] }],
        ],
        summaryDetailsEntries: mockSummaryDetailsEntries,
      },
    });

    expect(result.current.groupSummaryDetails).toEqual([
      {
        key: 'key1',
        path: 'path1',
        value: 'value1',
        isGroup: false,
        renderConfig: null,
      },
      {
        key: 'key2',
        path: 'path2',
        value: 'value2',
        isGroup: false,
        renderConfig: null,
      },
      {
        key: 'key3',
        path: 'path3',
        value: 'value3',
        isGroup: false,
        renderConfig: null,
      },
    ]);
  });

  it('should include summary entry in groupDetailsEntriesWithSummary when groupSummaryDetails.length > 0 and groupDetailsEntries.length > 1', () => {
    const mockGroupDetailsEntries: Array<[string, EventDetailsTabContent]> = [
      [
        'event-1',
        {
          eventLabel: 'Event 1',
          eventDetails: [],
        },
      ],
      [
        'event-2',
        {
          eventLabel: 'Event 2',
          eventDetails: [],
        },
      ],
    ];

    const mockSummaryDetailsEntries: Array<[string, EventDetailsTabContent]> = [
      [
        'event-1',
        {
          eventLabel: 'Event 1',
          eventDetails: [
            {
              key: 'key1',
              path: 'path1',
              value: 'value1',
              isGroup: false,
              renderConfig: null,
            },
          ],
        },
      ],
    ];

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      firstEventId: 'event-1',
    };

    const { result } = setup({
      eventGroup,
      mockGroupDetails: {
        groupDetailsEntries: mockGroupDetailsEntries,
        summaryDetailsEntries: mockSummaryDetailsEntries,
      },
    });

    expect(result.current.groupDetailsEntriesWithSummary).toHaveLength(3);
    expect(result.current.groupDetailsEntriesWithSummary[0][0]).toBe(
      'summary_event-1'
    );
    expect(result.current.groupDetailsEntriesWithSummary[0][1]).toEqual({
      eventDetails: [
        {
          key: 'key1',
          path: 'path1',
          value: 'value1',
          isGroup: false,
          renderConfig: null,
        },
      ],
      eventLabel: 'Summary',
    });
    expect(result.current.groupDetailsEntriesWithSummary.slice(1)).toEqual(
      mockGroupDetailsEntries
    );
  });

  it('should not include summary entry when groupSummaryDetails.length is 0', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      firstEventId: 'event-1',
    };

    const { result } = setup({
      eventGroup,
      mockGroupDetails: {
        groupDetailsEntries: [
          ['event-1', { eventLabel: 'Event 1', eventDetails: [] }],
          ['event-2', { eventLabel: 'Event 2', eventDetails: [] }],
        ],
        summaryDetailsEntries: [],
      },
    });

    expect(result.current.groupDetailsEntriesWithSummary).toHaveLength(2);
    expect(result.current.groupDetailsEntriesWithSummary[0][0]).toBe('event-1');
  });

  it('should not include summary entry when groupDetailsEntries.length is 1', () => {
    const mockSummaryDetailsEntries: Array<[string, EventDetailsTabContent]> = [
      [
        'event-1',
        {
          eventLabel: 'Event 1',
          eventDetails: [
            {
              key: 'key1',
              path: 'path1',
              value: 'value1',
              isGroup: false,
              renderConfig: null,
            },
          ],
        },
      ],
    ];

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      firstEventId: 'event-1',
    };

    const { result } = setup({
      eventGroup,
      mockGroupDetails: {
        groupDetailsEntries: [
          ['event-1', { eventLabel: 'Event 1', eventDetails: [] }],
        ],
        summaryDetailsEntries: mockSummaryDetailsEntries,
      },
    });

    expect(result.current.groupDetailsEntriesWithSummary).toHaveLength(1);
    expect(result.current.groupDetailsEntriesWithSummary[0][0]).toBe('event-1');
  });

  it('should hide summary when firstEventId is null', () => {
    const mockGroupDetailsEntries: Array<[string, EventDetailsTabContent]> = [
      [
        'event-1',
        {
          eventLabel: 'Event 1',
          eventDetails: [],
        },
      ],
      [
        'event-2',
        {
          eventLabel: 'Event 2',
          eventDetails: [],
        },
      ],
    ];

    const mockSummaryDetailsEntries: Array<[string, EventDetailsTabContent]> = [
      [
        'event-1',
        {
          eventLabel: 'Event 1',
          eventDetails: [
            {
              key: 'key1',
              path: 'path1',
              value: 'value1',
              isGroup: false,
              renderConfig: null,
            },
          ],
        },
      ],
    ];

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      firstEventId: null,
    };

    const { result } = setup({
      eventGroup,
      mockGroupDetails: {
        groupDetailsEntries: mockGroupDetailsEntries,
        summaryDetailsEntries: mockSummaryDetailsEntries,
      },
    });

    expect(result.current.groupDetailsEntriesWithSummary[0][0]).toBe('event-1');
    expect(result.current.groupDetailsEntriesWithSummary[1][0]).toBe('event-2');
  });
});

function setup({
  eventGroup,
  mockGroupDetails,
}: {
  eventGroup: HistoryEventsGroup;
  mockGroupDetails: {
    groupDetailsEntries: Array<[string, EventDetailsTabContent]>;
    summaryDetailsEntries: Array<[string, EventDetailsTabContent]>;
  };
}) {
  const mockGenerateHistoryGroupDetails = jest.spyOn(
    generateHistoryGroupDetailsModule,
    'default'
  );

  mockGenerateHistoryGroupDetails.mockReturnValue(mockGroupDetails);

  const { result } = renderHook(() => useGroupDetailsEntries(eventGroup));

  return {
    mockGenerateHistoryGroupDetails,
    result,
  };
}
