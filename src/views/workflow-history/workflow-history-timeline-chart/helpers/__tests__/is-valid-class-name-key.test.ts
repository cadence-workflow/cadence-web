import { type ClsObjectFor } from '@/hooks/use-styletron-classes';

import { type cssStyles } from '../../workflow-history-timeline-chart.styles';
import isValidClassNameKey from '../is-valid-class-name-key';

const MOCK_CSS_CLASS_NAMES: ClsObjectFor<typeof cssStyles> = {
  timerWaiting: 'timerWaiting',
  timerCompleted: 'timerCompleted',
  timerNegative: 'timerNegative',
  regularCompleted: 'regularCompleted',
  regularOngoing: 'regularOngoing',
  regularNegative: 'regularNegative',
  regularWaiting: 'regularWaiting',
  singleCompleted: 'singleCompleted',
  singleNegative: 'singleNegative',
  timerWaitingSelected: 'timerWaitingSelected',
  timerCompletedSelected: 'timerCompletedSelected',
  timerNegativeSelected: 'timerNegativeSelected',
  regularCompletedSelected: 'regularCompletedSelected',
  regularOngoingSelected: 'regularOngoingSelected',
  regularNegativeSelected: 'regularNegativeSelected',
  regularWaitingSelected: 'regularWaitingSelected',
  singleCompletedSelected: 'singleCompletedSelected',
  singleNegativeSelected: 'singleNegativeSelected',
};

describe(isValidClassNameKey.name, () => {
  it('returns true for a valid class name', () => {
    expect(isValidClassNameKey(MOCK_CSS_CLASS_NAMES, 'timerWaiting')).toEqual(
      true
    );
  });

  it('returns false for an ivalid class name', () => {
    expect(isValidClassNameKey(MOCK_CSS_CLASS_NAMES, 'invalid')).toEqual(false);
  });
});
