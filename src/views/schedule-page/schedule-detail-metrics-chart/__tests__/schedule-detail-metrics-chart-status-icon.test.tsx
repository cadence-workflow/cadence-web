import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import ScheduleDetailMetricsChartStatusIcon from '../schedule-detail-metrics-chart-status-icon';
import { type Props } from '../schedule-detail-metrics-chart-status-icon.types';

const ICON_SIZE_PX = 20;

const ICON_VARIANTS = [
  'completed',
  'failed',
  'canceled',
  'backfill',
  'next',
] as const satisfies ReadonlyArray<Props['variant']>;

describe(ScheduleDetailMetricsChartStatusIcon.name, () => {
  it.each(ICON_VARIANTS)(
    'renders a glyph at the requested size for the %s variant',
    (variant) => {
      const { container } = setup({ variant });

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveAttribute('width', String(ICON_SIZE_PX));
      expect(icon).toHaveAttribute('height', String(ICON_SIZE_PX));
    }
  );

  it('renders the skipped variant as an outline rather than an icon', () => {
    const { container } = setup({ variant: 'skipped' });

    expect(container.querySelector('svg')).not.toBeInTheDocument();
    expect(container.firstElementChild).toBeInTheDocument();
  });

  // The glyphs are decorative, so every variant is aria-hidden and only
  // reachable through the `hidden` role option.
  it('renders the running variant as a spinner', () => {
    setup({ variant: 'running' });

    expect(getSpinner()).toBeInTheDocument();
  });

  it('stops the spinner animation when the icon is not animated', () => {
    setup({ variant: 'running', animated: false });

    expect(getSpinner()).toHaveStyle({ animation: 'none' });
  });
});

function getSpinner() {
  return screen.getByRole('progressbar', { hidden: true });
}

function setup({ variant, animated }: Pick<Props, 'variant' | 'animated'>) {
  return render(
    <ScheduleDetailMetricsChartStatusIcon
      variant={variant}
      size={ICON_SIZE_PX}
      animated={animated}
    />
  );
}
