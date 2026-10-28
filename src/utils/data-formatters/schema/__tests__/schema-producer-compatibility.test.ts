import workflowDiagnosticsIssueSchema from '@/route-handlers/diagnose-workflow/schemas/workflow-diagnostics-issue-schema';
import workflowDiagnosticsRootCauseSchema from '@/route-handlers/diagnose-workflow/schemas/workflow-diagnostics-root-cause-schema';
import { allWorkflowEventsExtended } from '@/views/workflow-history/__fixtures__/all-workflow-event-types';
import { scheduleActivityTaskEvent } from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';

import {
  activityTaskScheduledEventSchema,
  historyEventSchema,
} from '../history-event-schema';
import {
  pendingActivityTaskStartSchema,
  pendingDecisionTaskStartSchema,
} from '../pending-history-event-schema';

describe('backend schema producer compatibility', () => {
  it.each(allWorkflowEventsExtended)(
    'continues to accept the $attributes fixture',
    (event) => {
      const schema =
        event.attributes === 'pendingActivityTaskStartEventAttributes'
          ? pendingActivityTaskStartSchema
          : event.attributes === 'pendingDecisionTaskStartEventAttributes'
            ? pendingDecisionTaskStartSchema
            : historyEventSchema;
      expect(schema.safeParse(event).success).toBe(true);
    }
  );

  it('preserves the proto-loader numeric-zero duration representation', () => {
    const event = {
      ...scheduleActivityTaskEvent,
      activityTaskScheduledEventAttributes: {
        ...scheduleActivityTaskEvent.activityTaskScheduledEventAttributes,
        scheduleToCloseTimeout: { seconds: 0, nanos: 0 },
      },
    };
    expect(
      activityTaskScheduledEventSchema.parse(event)
        .activityTaskScheduledEventAttributes.scheduleToCloseTimeout
    ).toEqual({ seconds: '0', nanos: 0 });
  });

  it.each([undefined, null, {}, { detail: 'value' }])(
    'accepts omitted or arbitrary diagnostic Metadata: %p',
    (metadata) => {
      const metadataFields =
        metadata === undefined ? {} : { Metadata: metadata };
      expect(
        workflowDiagnosticsIssueSchema.safeParse({
          IssueID: 1,
          InvariantType: 'test',
          Reason: 'test',
          ...metadataFields,
        }).success
      ).toBe(true);
      expect(
        workflowDiagnosticsRootCauseSchema.safeParse({
          IssueID: 1,
          RootCauseType: 'test',
          ...metadataFields,
        }).success
      ).toBe(true);
    }
  );
});
