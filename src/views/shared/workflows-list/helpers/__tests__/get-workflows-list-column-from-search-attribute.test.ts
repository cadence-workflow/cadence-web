import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import { mockWorkflowsListColumnsConfig } from '../../__fixtures__/mock-workflows-list-columns';
import getWorkflowsListColumnFromSearchAttribute from '../get-workflows-list-column-from-search-attribute';

jest.mock('../../config/workflows-list-columns.config', () => ({
  __esModule: true,
  default: mockWorkflowsListColumnsConfig,
}));

const mockRow = getMockWorkflowListItem({
  workflowID: 'wf-123',
  runID: 'run-456',
  workflowName: 'TestWorkflow',
  status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
  startTime: 1700000000000,
  closeTime: 1700003600000,
});

describe(getWorkflowsListColumnFromSearchAttribute.name, () => {
  it('returns a column with matcher properties when matched by name', () => {
    const column = getWorkflowsListColumnFromSearchAttribute(
      'WorkflowID',
      'INDEXED_VALUE_TYPE_KEYWORD'
    );

    expect(column).not.toBeNull();
    expect(column?.id).toBe('WorkflowID');
    expect(column?.name).toBe('Workflow ID');
    expect(column?.width).toBe('minmax(200px, 3fr)');
    expect(column?.isDefault).toBe(true);
  });

  it('binds renderCell to the attribute name when matched', () => {
    const column = getWorkflowsListColumnFromSearchAttribute(
      'WorkflowID',
      'INDEXED_VALUE_TYPE_KEYWORD'
    );

    expect(column?.renderCell(mockRow)).toBe('WorkflowID:wf-123');
  });

  it('returns a column when matched by type', () => {
    const column = getWorkflowsListColumnFromSearchAttribute(
      'CustomDateField',
      'INDEXED_VALUE_TYPE_DATETIME'
    );

    expect(column).not.toBeNull();
    expect(column?.id).toBe('CustomDateField');
    expect(column?.name).toBe('*CustomDateField');
    expect(column?.width).toBe('minmax(150px, 1.5fr)');
    expect(column?.isDefault).toBe(false);
  });

  it('returns null for system attributes without a matcher', () => {
    const column = getWorkflowsListColumnFromSearchAttribute(
      'DomainID',
      'INDEXED_VALUE_TYPE_KEYWORD'
    );

    expect(column).toBeNull();
  });

  it('returns a fallback column for custom attributes without a matcher', () => {
    const column = getWorkflowsListColumnFromSearchAttribute(
      'MyCustomField',
      'INDEXED_VALUE_TYPE_KEYWORD'
    );

    expect(column).not.toBeNull();
    expect(column?.id).toBe('MyCustomField');
    expect(column?.name).toBe('*MyCustomField');
    expect(column?.width).toBe('200px');
    expect(column?.isDefault).toBe(false);
  });

  it('renders custom attribute values via formatPayload', () => {
    const row = getMockWorkflowListItem({
      searchAttributes: {
        MyCustomField: { data: btoa('"custom-value"') },
      },
    });
    const column = getWorkflowsListColumnFromSearchAttribute(
      'MyCustomField',
      'INDEXED_VALUE_TYPE_KEYWORD'
    );

    expect(column?.renderCell(row)).toBe('custom-value');
  });

  it('renders null when custom attribute value is missing', () => {
    const row = getMockWorkflowListItem({ searchAttributes: {} });
    const column = getWorkflowsListColumnFromSearchAttribute(
      'MyCustomField',
      'INDEXED_VALUE_TYPE_KEYWORD'
    );

    expect(column?.renderCell(row)).toBe(null);
  });
});
