import { allWorkflowEvents } from '@/views/workflow-history/__fixtures__/all-workflow-event-types';

import formatWorkflowHistoryEvent from '..';

describe('formatWorkflowHistoryEvent', () => {
  allWorkflowEvents.forEach((event) => {
    it(`should format workflow ${event.attributes} to match snapshot`, () => {
      expect(formatWorkflowHistoryEvent(event)).toMatchSnapshot();
    });
  });
});
