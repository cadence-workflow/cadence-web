import { WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY } from '../../domain-workflows-basic-filters-status.constants';
import isWorkflowStatusBasicVisibility from '../is-workflow-status-basic-visibility';

describe(isWorkflowStatusBasicVisibility.name, () => {
  it('should return true for valid basic visibility workflow status', () => {
    Object.keys(WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY).forEach((key) => {
      expect(isWorkflowStatusBasicVisibility(key)).toBe(true);
    });
  });

  it('should return false for invalid basic visibility workflow status', () => {
    expect(isWorkflowStatusBasicVisibility('InvalidStatus')).toBe(false);
    expect(isWorkflowStatusBasicVisibility(123)).toBe(false);
    expect(isWorkflowStatusBasicVisibility(null)).toBe(false);
    expect(isWorkflowStatusBasicVisibility(undefined)).toBe(false);
    expect(isWorkflowStatusBasicVisibility({})).toBe(false);
    expect(isWorkflowStatusBasicVisibility([])).toBe(false);
  });
});
