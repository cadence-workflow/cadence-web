import getHistoryEventFieldRenderConfig from '../get-history-event-field-render-config';

const WORKFLOW_EXECUTION_PATHS = [
  ['workflowExecution', 'workflowId'],
  ['parentWorkflowExecution', 'parentWorkflowId'],
  ['externalWorkflowExecution', 'externalWorkflowId'],
] as const;

describe('getHistoryEventFieldRenderConfig', () => {
  describe('WorkflowExecution as link', () => {
    it.each(WORKFLOW_EXECUTION_PATHS)(
      'labels %s as %s when the event has no run id',
      (path, expectedLabel) => {
        expect(getLabel(path, { workflowId: 'wfid', runId: '' })).toBe(
          expectedLabel
        );
      }
    );

    it.each(WORKFLOW_EXECUTION_PATHS)(
      'labels %s as %s when run id is missing',
      (path, expectedLabel) => {
        expect(getLabel(path, { workflowId: 'wfid' })).toBe(expectedLabel);
      }
    );

    it.each(WORKFLOW_EXECUTION_PATHS)(
      'keeps the %s label when the event identifies a run',
      (path) => {
        expect(getLabel(path, { workflowId: 'wfid', runId: 'runid' })).toBe(
          path
        );
      }
    );
  });
});

function getLabel(path: string, value: object) {
  const key = path;
  const config = getHistoryEventFieldRenderConfig({ path, key, value });

  expect(config?.name).toBe('WorkflowExecution as link');

  return config?.getLabel?.({ path, key, value });
}
