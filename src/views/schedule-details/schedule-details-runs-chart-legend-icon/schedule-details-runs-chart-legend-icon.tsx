import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';
import {
  MdAdjust,
  MdBlock,
  MdCheckCircleOutline,
  MdReportGmailerrorred,
} from 'react-icons/md';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import getChartGlyphColor from '../schedule-details-runs-chart-glyph/helpers/get-chart-glyph-color';

import {
  staticSpinnerStyle,
  styled,
} from './schedule-details-runs-chart-legend-icon.styles';
import { type Props } from './schedule-details-runs-chart-legend-icon.types';

export default function ScheduleDetailsRunsChartLegendIcon({
  variant,
  size,
}: Props) {
  const [, theme] = useStyletron();
  const color = getChartGlyphColor(theme, variant);
  const iconProps = { color, size, 'aria-hidden': true } as const;

  switch (variant) {
    case WORKFLOW_STATUSES.completed:
    case WORKFLOW_STATUSES.continuedAsNew:
      return (
        <styled.Icon $size={size}>
          <MdCheckCircleOutline {...iconProps} />
        </styled.Icon>
      );
    case WORKFLOW_STATUSES.failed:
    case WORKFLOW_STATUSES.timedOut:
    case WORKFLOW_STATUSES.terminated:
      return (
        <styled.Icon $size={size}>
          <MdReportGmailerrorred {...iconProps} />
        </styled.Icon>
      );
    case WORKFLOW_STATUSES.running:
      return (
        <Spinner
          $size={size}
          $color={color}
          aria-hidden
          $style={staticSpinnerStyle}
        />
      );
    case WORKFLOW_STATUSES.canceled:
      return (
        <styled.Icon $size={size}>
          <MdBlock {...iconProps} />
        </styled.Icon>
      );
    case 'skipped':
      return <styled.Skipped $size={size} aria-hidden />;
    case 'next':
      return (
        <styled.Icon $size={size}>
          <MdAdjust {...iconProps} />
        </styled.Icon>
      );
  }
}
