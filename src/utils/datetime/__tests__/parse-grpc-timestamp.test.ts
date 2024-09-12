import parseGrpcTimestamp from '../parse-grpc-timestamp';

describe('parseGrpcTimestamp', () => {
  it('should parse GRPC timestamp correctly', () => {
    const time = { seconds: '1717408148', nanos: 258000000 };
    const parsedTimestamp = parseGrpcTimestamp(time);
    expect(parsedTimestamp).toEqual(1717408148258);
  });
});
