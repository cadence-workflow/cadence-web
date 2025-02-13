const formatTimestampToDatetime = (
  timestamp:
    | { seconds: number | string; nanos: number | string }
    | null
    | undefined
) =>
  timestamp
    ? new Date(
        parseInt(String(timestamp.seconds)) * 1000 +
          parseInt(String(timestamp.nanos)) / 1e6
      )
    : null;

export default formatTimestampToDatetime;
