import { styled as createStyled } from 'baseui';

import type { StyletronCSSObjectValue } from '@/hooks/use-styletron-classes';

import getBadgeContainerSize from './helpers/get-badge-container-size';
import { WORKFLOW_EVENT_STATUS } from './workflow-history-event-status-badge.constants';
import type {
  Props,
  WorkflowEventStatusBadgeSize,
} from './workflow-history-event-status-badge.types';

export const styled = {
  BadgeContainer: createStyled<
    'div',
    { $status: Props['status']; $size: WorkflowEventStatusBadgeSize }
  >('div', ({ $size, $status, $theme }) => {
    const containerSize = getBadgeContainerSize($theme, $size);

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px',
      flexShrink: 0,
      width: containerSize,
      height: containerSize,
      ...(
        {
          [WORKFLOW_EVENT_STATUS.COMPLETED]: {
            color: '#009A51',
            backgroundColor: '#D3EFDA',
          },
          [WORKFLOW_EVENT_STATUS.ONGOING]: {
            backgroundColor: '#DEE9FE',
          },
          [WORKFLOW_EVENT_STATUS.FAILED]: {
            color: $theme.colors.negative,
            backgroundColor: '#FFE1DE',
          },
          [WORKFLOW_EVENT_STATUS.CANCELED]: {
            color: $theme.colors.negative,
            backgroundColor: '#FFE1DE',
          },
          [WORKFLOW_EVENT_STATUS.WAITING]: {
            color: $theme.colors.black,
            backgroundColor: $theme.colors.backgroundSecondary,
          },
        } satisfies Record<Props['status'], StyletronCSSObjectValue>
      )[$status],
    };
  }),
};
