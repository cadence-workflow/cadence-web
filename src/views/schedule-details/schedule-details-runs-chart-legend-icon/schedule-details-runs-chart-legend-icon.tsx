import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import getChartGlyphColor from '../schedule-details-runs-chart/helpers/get-chart-glyph-color';
import getChartStatusIcon from '../schedule-details-runs-chart/helpers/get-chart-status-icon';

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
    case WORKFLOW_STATUSES.running:
      return (
        <Spinner
          $size={size}
          $color={color}
          aria-hidden
          $style={staticSpinnerStyle}
        />
      );
    case 'skipped':
      return <styled.Skipped $size={size} aria-hidden />;
    default: {
      const StatusIcon = getChartStatusIcon(variant);
      return (
        <styled.Icon $size={size}>
          <StatusIcon {...iconProps} />
        </styled.Icon>
      );
    }
  }
}
