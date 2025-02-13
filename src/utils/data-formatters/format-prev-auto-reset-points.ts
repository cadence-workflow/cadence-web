import { type ResetPoints } from '@/__generated__/proto-ts/uber/cadence/api/v1/ResetPoints';

import formatTimestampToDatetime from './format-timestamp-to-datetime';

const formatPrevAutoResetPoints = (prevAutoResetPoints: ResetPoints | null) => {
  const points = prevAutoResetPoints?.points;

  if (!points) {
    return null;
  }

  return {
    points: points.map(({ createdTime, expiringTime, ...point }) => ({
      ...point,
      createdTimeNano: formatTimestampToDatetime(createdTime),
      expiringTimeNano: formatTimestampToDatetime(expiringTime),
    })),
  };
};

export default formatPrevAutoResetPoints;
