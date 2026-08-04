import resolveChartSpanFromMarkerIntervalMs from '../resolve-chart-span-from-marker-interval-ms';

const hourMs = 60 * 60_000;

describe(resolveChartSpanFromMarkerIntervalMs.name, () => {
  it('maps marker cadence to a wider span when markers should overlap', () => {
    const comfortableSpanMs = resolveChartSpanFromMarkerIntervalMs({
      intervalMs: hourMs,
      chartWidthPx: 800,
      pxPerInterval: 48,
    });
    const overlappingSpanMs = resolveChartSpanFromMarkerIntervalMs({
      intervalMs: hourMs,
      chartWidthPx: 800,
      pxPerInterval: 20,
    });

    expect(overlappingSpanMs).toBeGreaterThan(comfortableSpanMs);
    expect(overlappingSpanMs / comfortableSpanMs).toBeCloseTo(48 / 20, 5);
  });
});
