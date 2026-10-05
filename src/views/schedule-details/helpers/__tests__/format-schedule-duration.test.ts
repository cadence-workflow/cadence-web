import formatDuration from '@/utils/data-formatters/format-duration';

import { formatScheduleDuration } from '../format-schedule-duration';

jest.mock('@/utils/data-formatters/format-duration', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockFormatDuration = jest.mocked(formatDuration);

describe(formatScheduleDuration.name, () => {
  beforeEach(() => {
    mockFormatDuration.mockReturnValue('formatted duration');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when duration is unset', () => {
    expect(formatScheduleDuration(null)).toBeNull();
    expect(formatScheduleDuration(undefined)).toBeNull();
    expect(mockFormatDuration).not.toHaveBeenCalled();
  });

  it('converts numeric seconds to string and passes nanos to formatDuration', () => {
    formatScheduleDuration({ seconds: 3600, nanos: 0 });
    expect(mockFormatDuration).toHaveBeenCalledWith({
      seconds: '3600',
      nanos: 0,
    });
  });

  it('returns formatted duration when seconds & nanos are provided', () => {
    expect(formatScheduleDuration({ seconds: '3600', nanos: 500000000 })).toBe(
      'formatted duration'
    );
  });
});
