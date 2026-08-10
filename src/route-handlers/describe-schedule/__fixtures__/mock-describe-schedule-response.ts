import { type DescribeScheduleResponse } from '../describe-schedule.types';

export const mockDescribeScheduleResponse: DescribeScheduleResponse = {
  spec: null,
  action: null,
  policies: null,
  state: { paused: false, pauseInfo: null },
  info: null,
  memo: null,
  searchAttributes: null,
};

export function getMockDescribeScheduleResponse(
  overrides: Partial<DescribeScheduleResponse> = {}
): DescribeScheduleResponse {
  return {
    ...mockDescribeScheduleResponse,
    ...overrides,
  };
}

export function getMockRunningDescribeScheduleResponse(
  overrides: Partial<DescribeScheduleResponse> = {}
): DescribeScheduleResponse {
  return getMockDescribeScheduleResponse({
    state: { paused: false, pauseInfo: null },
    ...overrides,
  });
}

export function getMockPausedDescribeScheduleResponse(
  overrides: Partial<DescribeScheduleResponse> = {}
): DescribeScheduleResponse {
  return getMockDescribeScheduleResponse({
    state: {
      paused: true,
      pauseInfo: {
        pausedBy: 'operator@example.com',
        reason: 'Paused for maintenance',
        pausedAt: null,
      },
    },
    ...overrides,
  });
}
