import { createElement } from 'react';

import FormattedDate from '@/components/formatted-date/formatted-date';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import workflowsListColumnMatchers from '../workflows-list-columns.config';

const mockRow = getMockWorkflowListItem({
  workflowID: 'wf-123',
  runID: 'run-456',
  workflowName: 'TestWorkflow',
  status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
  startTime: 1700000000000,
  closeTime: 1700003600000,
});

describe('workflowsListColumnMatchers', () => {
  it('matches WorkflowID with correct metadata', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('WorkflowID', '')
    );

    expect(matcher).toBeDefined();
    expect(matcher?.name).toBe('Workflow ID');
    expect(matcher?.width).toBe('minmax(200px, 3fr)');
    expect(matcher?.isDefault).toBe(true);
  });

  it('renders the workflow ID from the row for WorkflowID', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('WorkflowID', '')
    );

    expect(matcher?.renderCell(mockRow, 'WorkflowID')).toBe('wf-123');
  });

  it('matches CloseStatus with correct metadata', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('CloseStatus', '')
    );

    expect(matcher).toBeDefined();
    expect(matcher?.name).toBe('Status');
    expect(matcher?.width).toBe('minmax(100px, 1fr)');
    expect(matcher?.isDefault).toBe(true);
  });

  it('renders a WorkflowStatusTag element for CloseStatus', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('CloseStatus', '')
    );

    expect(matcher?.renderCell(mockRow, 'CloseStatus')).toEqual(
      createElement(WorkflowStatusTag, {
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      })
    );
  });

  it('matches RunID with correct metadata', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('RunID', '')
    );

    expect(matcher).toBeDefined();
    expect(matcher?.name).toBe('Run ID');
    expect(matcher?.width).toBe('minmax(200px, 3fr)');
    expect(matcher?.isDefault).toBe(true);
  });

  it('renders the run ID from the row for RunID', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('RunID', '')
    );

    expect(matcher?.renderCell(mockRow, 'RunID')).toBe('run-456');
  });

  it('matches WorkflowType with correct metadata', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('WorkflowType', '')
    );

    expect(matcher).toBeDefined();
    expect(matcher?.name).toBe('Workflow Type');
    expect(matcher?.width).toBe('2fr');
    expect(matcher?.isDefault).toBe(true);
  });

  it('renders the workflow name from the row for WorkflowType', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('WorkflowType', '')
    );

    expect(matcher?.renderCell(mockRow, 'WorkflowType')).toBe('TestWorkflow');
  });

  it('matches StartTime with correct metadata', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('StartTime', '')
    );

    expect(matcher).toBeDefined();
    expect(matcher?.name).toBe('Started');
    expect(matcher?.width).toBe('minmax(150px, 1.5fr)');
    expect(matcher?.isDefault).toBe(true);
  });

  it('renders a FormattedDate with startTime for StartTime', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('StartTime', '')
    );

    expect(matcher?.renderCell(mockRow, 'StartTime')).toEqual(
      createElement(FormattedDate, { timestampMs: 1700000000000 })
    );
  });

  it('matches CloseTime with correct metadata', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('CloseTime', '')
    );

    expect(matcher).toBeDefined();
    expect(matcher?.name).toBe('Ended');
    expect(matcher?.width).toBe('minmax(150px, 1.5fr)');
    expect(matcher?.isDefault).toBe(true);
  });

  it('renders a FormattedDate with closeTime for CloseTime', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('CloseTime', '')
    );

    expect(matcher?.renderCell(mockRow, 'CloseTime')).toEqual(
      createElement(FormattedDate, { timestampMs: 1700003600000 })
    );
  });

  it('matches any attribute with DATETIME type', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('CustomDate', 'INDEXED_VALUE_TYPE_DATETIME')
    );

    expect(matcher).toBeDefined();
    expect(matcher?.name).toBeUndefined();
    expect(matcher?.width).toBe('minmax(150px, 1.5fr)');
    expect(matcher?.isDefault).toBeUndefined();
  });

  it('renders a FormattedDate for valid datetime search attributes', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('CustomDate', 'INDEXED_VALUE_TYPE_DATETIME')
    );
    const row = getMockWorkflowListItem({
      searchAttributes: {
        CustomDate: { data: btoa('"2023-11-14T12:00:00Z"') },
      },
    });

    expect(matcher?.renderCell(row, 'CustomDate')).toEqual(
      createElement(FormattedDate, {
        timestampMs: Date.parse('2023-11-14T12:00:00Z'),
      })
    );
  });

  it('renders empty string for null DATETIME search attribute values', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('CustomDate', 'INDEXED_VALUE_TYPE_DATETIME')
    );
    const row = getMockWorkflowListItem({ searchAttributes: {} });

    expect(matcher?.renderCell(row, 'CustomDate')).toBe('');
  });

  it('renders empty string when search attributes are missing for DATETIME', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('CustomDate', 'INDEXED_VALUE_TYPE_DATETIME')
    );
    const row = getMockWorkflowListItem();

    expect(matcher?.renderCell(row, 'CustomDate')).toBe('');
  });

  it('gives priority to name matchers over type matchers', () => {
    const matchers = workflowsListColumnMatchers.filter((m) =>
      m.match('StartTime', 'INDEXED_VALUE_TYPE_DATETIME')
    );

    expect(matchers[0]?.name).toBe('Started');
  });

  it('does not match unrecognized attribute names with non-matching types', () => {
    const matcher = workflowsListColumnMatchers.find((m) =>
      m.match('UnknownAttribute', 'KEYWORD')
    );

    expect(matcher).toBeUndefined();
  });
});
