import parseGrpcTimestamp from '../parse-grpc-timestamp';

describe('parseGrpcTimestamp', () => {
  it('should parse GRPC timestamp correctly', () => {
    const time = { seconds: 1717408148, nanos: 258000000 };
    const parsedTimestamp = parseGrpcTimestamp(time);
    expect(parsedTimestamp).toEqual(1717408148258);
  });

  it('should handle empty time', () => {
    const time = {};
    const parsedTimestamp = parseGrpcTimestamp(time);
    expect(parsedTimestamp).toBeNaN();
  });

  it('should handle invalid time object', () => {
    const time = {
      seconds: undefined,
      nanos: undefined,
    };
    const parsedTimestamp = parseGrpcTimestamp(time);
    expect(parsedTimestamp).toBeNaN();
  });
});
