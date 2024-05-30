export type Props = {
  inputJson: JsonValue;
  resultJson: JsonValue;
};

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
