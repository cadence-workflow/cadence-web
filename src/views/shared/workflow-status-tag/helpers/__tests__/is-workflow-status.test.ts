import isWorkflowStatus from '../is-workflow-status';
import { WORKFLOW_STATUS_NAMES } from '../../workflow-status-tag.constants';

describe('isWorkflowStatus', () => {
  it('should return true for valid workflow status', () => {
    Object.keys(WORKFLOW_STATUS_NAMES).forEach((key) => {
      expect(isWorkflowStatus(key)).toBe(true);
    });
  });

  it('should return false for invalid workflow status', () => {
    expect(isWorkflowStatus('InvalidStatus')).toBe(false);
    expect(isWorkflowStatus(123)).toBe(false);
    expect(isWorkflowStatus(null)).toBe(false);
    expect(isWorkflowStatus(undefined)).toBe(false);
    expect(isWorkflowStatus({})).toBe(false);
    expect(isWorkflowStatus([])).toBe(false);
  });
});
