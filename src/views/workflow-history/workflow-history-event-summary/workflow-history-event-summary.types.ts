import { type ComponentType } from 'react';

import { type IconProps } from 'baseui/icon';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import {
  type ExtendedHistoryEvent,
  type HistoryGroupEventMetadata,
} from '../workflow-history.types';

export type EventSummaryValueComponentProps = {
  name: string;
  value: any;
  isNegative?: boolean;
} & WorkflowPageParams;

export type WorkflowHistoryEventSummaryField = {
  name: string;
  value: any;
  renderConfig: WorkflowHistoryEventSummaryRenderConfig;
};

export type WorkflowHistoryEventSummaryRenderConfig = {
  name: string;
  matcher: (name: string, value: unknown) => boolean;
  icon: React.ComponentType<{
    size?: IconProps['size'];
    color?: IconProps['color'];
  }> | null;
  renderValue: ComponentType<EventSummaryValueComponentProps>;
  renderHoverContent?: ComponentType<EventSummaryValueComponentProps>;
  invertPopoverColours?: boolean;
  shouldHide?: (props: EventSummaryValueComponentProps) => boolean;
};

export type Props = {
  event: ExtendedHistoryEvent;
  eventMetadata: HistoryGroupEventMetadata;
} & WorkflowPageParams;
