// TODO @adhitya.mamallan - Replace this with the GRPC timestamp generated type
export default function parseGrpcTimestamp(time: {
  seconds?: number;
  nanos?: number;
}): number {
  if (!time.seconds || !time.nanos) {
    return NaN;
  }
  return time.seconds * 1000 + time.nanos / 1000000;
}
