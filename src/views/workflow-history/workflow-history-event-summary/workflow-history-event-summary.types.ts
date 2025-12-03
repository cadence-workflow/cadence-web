import { type ComponentType } from 'react';

import { type IconProps } from 'baseui/icon';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import {
  type ExtendedHistoryEvent,
  type HistoryGroupEventMetadata,
} from '../workflow-history.types';

export type EventSummaryValueComponentProps = {
  label: string;
  value: any;
  isNegative?: boolean;
} & WorkflowPageParams;

export type WorkflowHistoryEventSummaryFieldParser = {
  name: string;
  matcher: (path: string, value: unknown) => boolean;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }> | null;
  shouldHide?: (path: string, value: unknown) => boolean;
  tooltipLabel?: string;
  customRenderValue?: ComponentType<EventSummaryValueComponentProps>;
  hideDefaultTooltip?: boolean;
};

export type WorkflowHistoryEventSummaryItem = {
  path: string;
  label: string;
  value: any;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }> | null;
  renderValue: ComponentType<EventSummaryValueComponentProps>;
  hideDefaultTooltip?: boolean;
};

export type Props = {
  event: ExtendedHistoryEvent;
  eventMetadata: Pick<
    HistoryGroupEventMetadata,
    'summaryFields' | 'additionalDetails' | 'negativeFields'
  >;
  shouldReverseRow?: boolean;
} & WorkflowPageParams;
