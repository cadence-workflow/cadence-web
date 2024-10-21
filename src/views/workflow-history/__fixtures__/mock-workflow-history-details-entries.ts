import { type WorkflowHistoryEventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';

export const mockWorkflowHistoryDetailsEntries: WorkflowHistoryEventDetailsEntries =
  [
    {
      key: 'version',
      path: 'version',
      isGroup: false,
      value: 1,
      renderConfig: null,
    },
    {
      key: 'taskId',
      path: 'taskId',
      isGroup: false,
      value: '1234567890',
      renderConfig: null,
    },
    {
      key: 'eventId',
      path: 'eventId',
      isGroup: false,
      value: 1,
      renderConfig: null,
    },
    {
      key: 'timestamp',
      path: 'timestamp',
      isGroup: false,
      value: new Date('2024-10-14T12:34:18.721Z'),
      renderConfig: null,
    },
    {
      key: 'fields',
      path: 'header.fields',
      isGroup: true,
      renderConfig: null,
      groupEntries: [
        {
          key: 'data',
          path: 'header.fields.mockField1.data',
          isGroup: false,
          value: 'mock-data-1',
          renderConfig: null,
        },
        {
          key: 'data',
          path: 'header.fields.mockField2.data',
          isGroup: false,
          value: 'mock-data-2',
          renderConfig: null,
        },
        {
          key: 'data',
          path: 'header.fields.mockField3.data',
          isGroup: true,
          renderConfig: null,
          groupEntries: [
            {
              key: 'subField',
              path: 'header.fields.mockField3.data.subField',
              isGroup: false,
              value: 'mock-data-3.1',
              renderConfig: null,
            },
            {
              key: 'subTimestamp',
              path: 'header.fields.mockField3.data.subTimestamp',
              isGroup: false,
              value: new Date('2024-10-14T11:34:18.721Z'),
              renderConfig: null,
            },
          ],
        },
      ],
    },
  ];
