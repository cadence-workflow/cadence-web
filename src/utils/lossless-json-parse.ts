import { parse, isSafeNumber, isInteger, type Reviver } from 'lossless-json';

export default function losslessJsonParse(
  json: string,
  reviver?: Reviver | null | undefined
) {
  return parse(json, reviver, (value) => {
    if (!isSafeNumber(value)) {
      return BigInt(value);
    }
    if (isInteger(value)) {
      return parseInt(value);
    }
    return parseFloat(value);
  });
}
