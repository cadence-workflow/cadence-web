import React from 'react';

import { Spinner } from 'baseui/spinner';
import {
  MdAdjust,
  MdBlock,
  MdCheckCircle,
  MdHistory,
  MdReportGmailerrorred,
} from 'react-icons/md';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { getScheduleMetricsChartStatusColor } from './helpers/get-schedule-metrics-chart-status';
import {
  staticSpinnerStyle,
  styled,
} from './schedule-detail-metrics-chart-status-icon.styles';
import { type Props } from './schedule-detail-metrics-chart-status-icon.types';
import { CHART_FAILED_ICON_SCALE } from './schedule-detail-metrics-chart.constants';

export default function ScheduleDetailMetricsChartStatusIcon({
  variant,
  size,
  animated = true,
}: Props) {
  const { theme } = useStyletronClasses({});
  const color = getScheduleMetricsChartStatusColor(theme, variant);
  const props = { color, size, 'aria-hidden': true } as const;

  switch (variant) {
    case 'completed':
      return (
        <styled.Icon $size={size}>
          <MdCheckCircle {...props} />
        </styled.Icon>
      );
    case 'failed':
      return (
        <styled.Icon $size={size} $scale={CHART_FAILED_ICON_SCALE}>
          <MdReportGmailerrorred {...props} />
        </styled.Icon>
      );
    case 'running':
      return (
        <Spinner
          $size={size}
          $color={color}
          aria-hidden
          $style={animated ? undefined : staticSpinnerStyle}
        />
      );
    case 'canceled':
      return (
        <styled.Icon $size={size}>
          <MdBlock {...props} />
        </styled.Icon>
      );
    case 'backfill':
      return (
        <styled.Icon $size={size}>
          <MdHistory {...props} />
        </styled.Icon>
      );
    case 'skipped':
      return <styled.Skipped $size={size} aria-hidden />;
    case 'next':
      return (
        <styled.Icon $size={size}>
          <MdAdjust {...props} />
        </styled.Icon>
      );
  }
}
