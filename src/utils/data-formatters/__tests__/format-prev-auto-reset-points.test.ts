import { type ResetPoints } from '@/__generated__/proto-ts/uber/cadence/api/v1/ResetPoints';

import formatPrevAutoResetPoints from '../format-prev-auto-reset-points';
import formatTimestampToDatetime from '../format-timestamp-to-datetime';

jest.mock('../format-timestamp-to-datetime', () => jest.fn());
const mockedFormatTimestampToDatetime =
  formatTimestampToDatetime as jest.MockedFunction<
    typeof formatTimestampToDatetime
  >;

describe('formatPrevAutoResetPoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return null if prevAutoResetPoints is not provided', () => {
    // @ts-expect-error Testing with `undefined`
    expect(formatPrevAutoResetPoints(undefined)).toBeNull();
  });

  test('should return null if prevAutoResetPoints is null', () => {
    expect(formatPrevAutoResetPoints(null)).toBeNull();
  });

  test('should return empty array if points array is empty', () => {
    const prevAutoResetPoints = { points: [] };
    expect(formatPrevAutoResetPoints(prevAutoResetPoints)).toEqual({
      points: [],
    });
  });

  test('should format prevAutoResetPoints correctly for valid input', () => {
    const prevAutoResetPoints: ResetPoints = {
      points: [
        {
          createdTime: { seconds: '1623153200', nanos: 0 },
          expiringTime: { seconds: '1623239600', nanos: 0 },
          binaryChecksum: '122434',
          firstDecisionCompletedId: '123',
          resettable: true,
          runId: '2348yjk',
        },
      ],
    };

    const formattedCreatedTime1 = new Date(1623153200000);
    const formattedCreatedTime2 = new Date(1623239600000);
    const expectedFormattedPoints = {
      points: [
        {
          binaryChecksum: '122434',
          firstDecisionCompletedId: '123',
          resettable: true,
          runId: '2348yjk',
          createdTimeNano: formattedCreatedTime1,
          expiringTimeNano: formattedCreatedTime2,
        },
      ],
    };
    mockedFormatTimestampToDatetime
      .mockReturnValueOnce(formattedCreatedTime1)
      .mockReturnValueOnce(formattedCreatedTime2);

    expect(formatPrevAutoResetPoints(prevAutoResetPoints)).toEqual(
      expectedFormattedPoints
    );
    expect(formatTimestampToDatetime).toHaveBeenCalledWith({
      seconds: '1623153200',
      nanos: 0,
    });
    expect(formatTimestampToDatetime).toHaveBeenCalledWith({
      seconds: '1623239600',
      nanos: 0,
    });
  });

  test('should format prevAutoResetPoints correctly when createdTime or expiringTime is missing', () => {
    const prevAutoResetPoints: ResetPoints = {
      points: [
        {
          createdTime: { seconds: '1623153200', nanos: 0 },
          expiringTime: { seconds: '1623239600', nanos: 0 },
          binaryChecksum: '122434',
          firstDecisionCompletedId: '123',
          resettable: true,
          runId: '2348yjk',
        },
      ],
    };
    const formattedCreatedTime1 = new Date(1623153200000);
    const expectedFormattedPoints = {
      points: [
        {
          createdTimeNano: formattedCreatedTime1,
          expiringTimeNano: null,
          binaryChecksum: '122434',
          firstDecisionCompletedId: '123',
          resettable: true,
          runId: '2348yjk',
        },
      ],
    };
    mockedFormatTimestampToDatetime
      .mockReturnValueOnce(formattedCreatedTime1)
      .mockReturnValueOnce(null);

    expect(formatPrevAutoResetPoints(prevAutoResetPoints)).toEqual(
      expectedFormattedPoints
    );
    expect(formatTimestampToDatetime).toHaveBeenCalledWith({
      seconds: '1623153200',
      nanos: 0,
    });
  });
});
