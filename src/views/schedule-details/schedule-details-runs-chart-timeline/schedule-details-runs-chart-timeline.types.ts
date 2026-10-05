import { type ChartXScale } from '../schedule-details-runs-chart/schedule-details-runs-chart.types';

export type Props = {
  width: number;
  height: number;
  xScale: ChartXScale;
  nowMs: number;
};
