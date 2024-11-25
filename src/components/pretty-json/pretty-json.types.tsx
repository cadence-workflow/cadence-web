export type Props = {
  json: PrettyJsonValue;
};

export type PrettyJsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray
  | bigint;

type JsonObject = { [key: string]: PrettyJsonValue };
type JsonArray = PrettyJsonValue[];
