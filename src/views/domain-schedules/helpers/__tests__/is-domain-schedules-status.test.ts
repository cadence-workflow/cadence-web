import { isDomainSchedulesStatus } from '../is-domain-schedules-status';

describe('isDomainSchedulesStatus', () => {
  it('returns true for valid statuses', () => {
    expect(isDomainSchedulesStatus('RUNNING')).toBe(true);
    expect(isDomainSchedulesStatus('PAUSED')).toBe(true);
  });

  it('returns false for invalid statuses', () => {
    expect(isDomainSchedulesStatus('running')).toBe(false);
    expect(isDomainSchedulesStatus('')).toBe(false);
    expect(isDomainSchedulesStatus('OTHER')).toBe(false);
  });
});
