import { renderHook } from '@/test-utils/rtl';

import { mockActivityEventGroup } from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import { TIMELINE_DOMAIN_BUFFER_RATIO } from '../../workflow-history-timeline.constants';
import { type TimelineRow } from '../../workflow-history-timeline.types';
import useSteppedDomainMaxMs from '../use-stepped-domain-max-ms';

const mockWorkflowStartTimeMs = 1705312800000;

describe(useSteppedDomainMaxMs.name, () => {
  it('returns exact close time offset without buffer when workflow is closed', () => {
    const workflowCloseTimeMs = mockWorkflowStartTimeMs + 10000;
    const currentTimeMs = mockWorkflowStartTimeMs + 15000;

    const { result } = setup({
      timelineRows: [],
      workflowStartTimeMs: mockWorkflowStartTimeMs,
      workflowCloseTimeMs,
      currentTimeMs,
    });

    // Should return closeTime - startTime (the exact offset, no buffer)
    expect(result.current).toBe(workflowCloseTimeMs - mockWorkflowStartTimeMs);
  });

  it('returns current time offset multiplied by buffer ratio when workflow is running', () => {
    const currentTimeMs = mockWorkflowStartTimeMs + 5000;

    const { result } = setup({
      timelineRows: [],
      workflowStartTimeMs: mockWorkflowStartTimeMs,
      workflowCloseTimeMs: null,
      currentTimeMs,
    });

    const expectedOffset = currentTimeMs - mockWorkflowStartTimeMs;
    const expectedWithBuffer =
      expectedOffset * (1 + TIMELINE_DOMAIN_BUFFER_RATIO);

    expect(result.current).toBe(expectedWithBuffer);
  });

  it('maintains existing domain value when new required offset is within buffered range', () => {
    const currentTimeMs = mockWorkflowStartTimeMs + 5000;

    const { result, rerender } = setup({
      timelineRows: [],
      workflowStartTimeMs: mockWorkflowStartTimeMs,
      workflowCloseTimeMs: null,
      currentTimeMs,
    });

    const initialDomain = result.current;

    // Advance time, but not enough to exceed the buffer
    const smallerTimeMs = mockWorkflowStartTimeMs + 5500;
    rerender({ currentTimeMs: smallerTimeMs });

    // Domain should remain the same since we're still within buffer
    expect(result.current).toBe(initialDomain);
  });

  it('recalculates domain with buffer when required offset exceeds current domain', () => {
    const currentTimeMs = mockWorkflowStartTimeMs + 5000;

    const { result, rerender } = setup({
      timelineRows: [],
      workflowStartTimeMs: mockWorkflowStartTimeMs,
      workflowCloseTimeMs: null,
      currentTimeMs,
    });

    const initialDomain = result.current;

    // Advance time beyond the buffer
    const largerTimeMs = mockWorkflowStartTimeMs + initialDomain + 1000;
    rerender({ currentTimeMs: largerTimeMs });

    const newOffset = largerTimeMs - mockWorkflowStartTimeMs;
    const expectedNewDomain = newOffset * (1 + TIMELINE_DOMAIN_BUFFER_RATIO);

    expect(result.current).toBe(expectedNewDomain);
    expect(result.current).toBeGreaterThan(initialDomain);
  });

  it('returns row end time offset with buffer when row end time exceeds current time', () => {
    const currentTimeMs = mockWorkflowStartTimeMs + 5000;
    const rowEndTimeMs = mockWorkflowStartTimeMs + 8000;

    const timelineRows: Array<TimelineRow> = [
      {
        id: '1',
        label: 'Test',
        startTimeMs: mockWorkflowStartTimeMs + 1000,
        endTimeMs: rowEndTimeMs,
        groupType: 'ACTIVITY',
        status: 'COMPLETED',
        group: mockActivityEventGroup,
      },
    ];

    const { result } = setup({
      timelineRows,
      workflowStartTimeMs: mockWorkflowStartTimeMs,
      workflowCloseTimeMs: null,
      currentTimeMs,
    });

    // Domain should be based on the row end time (which is greater than currentTimeMs)
    const expectedOffset = rowEndTimeMs - mockWorkflowStartTimeMs;
    const expectedWithBuffer =
      expectedOffset * (1 + TIMELINE_DOMAIN_BUFFER_RATIO);

    expect(result.current).toBe(expectedWithBuffer);
  });
});

function setup({
  timelineRows,
  workflowStartTimeMs,
  workflowCloseTimeMs,
  currentTimeMs,
}: {
  timelineRows: Array<TimelineRow>;
  workflowStartTimeMs: number;
  workflowCloseTimeMs: number | null | undefined;
  currentTimeMs: number;
}) {
  return renderHook(
    (props = { currentTimeMs }) =>
      useSteppedDomainMaxMs({
        timelineRows,
        workflowStartTimeMs,
        workflowCloseTimeMs,
        currentTimeMs: props.currentTimeMs,
      }),
    undefined,
    { initialProps: { currentTimeMs } }
  );
}
