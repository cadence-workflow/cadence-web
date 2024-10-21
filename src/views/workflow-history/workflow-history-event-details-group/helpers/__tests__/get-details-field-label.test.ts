import {
  type WorkflowHistoryEventDetailsGroupEntry,
  type WorkflowHistoryEventDetailsEntry,
} from '../../../workflow-history-event-details/workflow-history-event-details.types';
import getDetailsFieldLabel from '../get-details-field-label';

const singleEntry: WorkflowHistoryEventDetailsEntry = {
  key: 'testKey',
  path: 'testKey',
  isGroup: false,
  value: 'testValue',
  renderConfig: {
    name: 'Mock render config without custom label',
    customMatcher: () => true,
  },
};

const groupEntry: WorkflowHistoryEventDetailsGroupEntry = {
  key: 'testKey',
  path: 'testKey',
  isGroup: true,
  groupEntries: [
    {
      key: 'testKey1',
      path: 'testKey.testKey1',
      isGroup: false,
      value: 'testValue1',
      renderConfig: null,
    },
    {
      key: 'testKey2',
      path: 'testKey.testKey2',
      isGroup: false,
      value: 'testValue2',
      renderConfig: null,
    },
  ],
  renderConfig: {
    name: 'Mock render config without custom label',
    customMatcher: () => true,
  },
};

describe('getDetailsFieldLabel', () => {
  it('should return the label from renderConfig if getLabel is defined', () => {
    const mockGetLabel = jest.fn().mockReturnValue('Custom Label');

    const entry = {
      ...singleEntry,
      renderConfig: {
        name: 'Mock render config with custom label',
        customMatcher: () => true,
        getLabel: mockGetLabel,
      },
    };

    expect(getDetailsFieldLabel(entry)).toBe('Custom Label');

    expect(mockGetLabel).toHaveBeenCalledWith({
      key: 'testKey',
      path: 'testKey',
      value: 'testValue',
    });
  });

  it('should return the default label if renderConfig.getLabel is not defined', () => {
    expect(getDetailsFieldLabel(singleEntry)).toBe('testKey');
  });

  it('should append the number of entries to label for group entries', () => {
    const entry = {
      ...groupEntry,
      renderConfig: {
        name: 'Mock render config with custom label',
        customMatcher: () => true,
        getLabel: jest.fn().mockReturnValue('Custom Label'),
      },
    };

    expect(getDetailsFieldLabel(entry)).toBe('Custom Label (2)');
  });

  it('should append the number of entries to default label for group entries', () => {
    expect(getDetailsFieldLabel(groupEntry)).toBe('testKey (2)');
  });

  it('should subtract the parent path correctly for a child path', () => {
    expect(getDetailsFieldLabel(groupEntry.groupEntries[0], 'testKey')).toBe(
      'testKey1'
    );
  });
});
