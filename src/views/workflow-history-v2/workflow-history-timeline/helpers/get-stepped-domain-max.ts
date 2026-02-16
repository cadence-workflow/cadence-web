import { TIMELINE_DOMAIN_BUFFER_PERCENT } from '../workflow-history-timeline.constants';

/**
 * Calculates a stepped domain max that expands in increments.
 * The domain always maintains at least TIMELINE_DOMAIN_BUFFER_PERCENT empty space.
 * When events fill that space, the domain expands by another buffer increment.
 *
 * @param requiredMaxMs - The minimum domain max needed to display all events
 * @param currentDomainMax - The current displayed domain max (null on first render)
 * @returns The new domain max value
 */
export default function getSteppedDomainMax(
  requiredMaxMs: number,
  currentDomainMax: number | null
): number {
  const bufferedMax = requiredMaxMs * (1 + TIMELINE_DOMAIN_BUFFER_PERCENT);

  // First render: start with required + buffer
  if (currentDomainMax === null) {
    return bufferedMax;
  }

  // If required max exceeds current domain, expand by another step
  if (requiredMaxMs >= currentDomainMax) {
    return bufferedMax;
  }

  // Otherwise, keep current domain (no shrinking)
  return currentDomainMax;
}
