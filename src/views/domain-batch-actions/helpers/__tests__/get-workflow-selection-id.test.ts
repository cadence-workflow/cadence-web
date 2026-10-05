import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import getWorkflowSelectionId from '../get-workflow-selection-id';

describe(getWorkflowSelectionId.name, () => {
  it('uses the run id as the selection id', () => {
    expect(
      getWorkflowSelectionId(
        getMockWorkflowListItem({ workflowID: 'wf-1', runID: 'run-1' })
      )
    ).toBe('run-1');
  });
});
