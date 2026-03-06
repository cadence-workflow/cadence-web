import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import getEventGroupCategory from '../get-event-group-category';

jest.mock(
  '../../config/workflow-history-event-group-type-to-category.config',
  () => ({
    __esModule: true,
    default: {
      Activity: 'ACTIVITY',
      Decision: jest.fn((group: HistoryEventsGroup) =>
        group.status === 'COMPLETED' ? 'DECISION' : 'WORKFLOW'
      ),
    },
  })
);

describe(getEventGroupCategory.name, () => {
  it('should return the category directly when config value is a string', () => {
    const group = { groupType: 'Activity' } as HistoryEventsGroup;

    expect(getEventGroupCategory(group)).toBe('ACTIVITY');
  });

  it('should call the config function and return its result when config value is a function', () => {
    const completedGroup = {
      groupType: 'Decision',
      status: 'COMPLETED',
    } as HistoryEventsGroup;

    expect(getEventGroupCategory(completedGroup)).toBe('DECISION');

    const ongoingGroup = {
      groupType: 'Decision',
      status: 'ONGOING',
    } as HistoryEventsGroup;

    expect(getEventGroupCategory(ongoingGroup)).toBe('WORKFLOW');
  });
});
