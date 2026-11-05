import losslessJsonParse from '../lossless-json-parse';

import formatBase64Payload from './format-base64-payload';
import formatPayload from './format-payload';

const separators = ['\n', ' '];

const formatInputPayload = (
  payload: { data?: string | null } | null | undefined
) => {
  const data = payload?.data;
  if (!data) {
    return null;
  }

  const parsedData = formatBase64Payload(data);

  // try parsing as JSON values, one per input
  try {
    return parseMultipleInputs(parsedData);
  } catch {
    // fall back to formatting it like a single payload, as a list of inputs
    const formatted = formatPayload(payload);
    return Array.isArray(formatted) ? formatted : [formatted];
  }
};

const parseMultipleInputs = (input: string) => {
  const results = [];
  let currentIndex = 0;

  while (currentIndex < input.length) {
    while (separators.includes(input[currentIndex])) {
      currentIndex++;
    }
    if (currentIndex >= input.length) break;

    const { startIndex, endIndex, jsonString } = extractJsonValue(
      input,
      currentIndex
    );

    if (endIndex > startIndex) {
      currentIndex = endIndex;
      results.push(losslessJsonParse(jsonString));
    } else {
      currentIndex++;
    }
  }

  return results;
};

const extractJsonValue = (input: string, startIndex: number) => {
  let endIndex = startIndex;
  let openBrackets = 0;
  let openBraces = 0;
  let inString = false;
  let escapeNext = false; // used to handle escaped quotes

  while (endIndex < input.length) {
    const char = input[endIndex];

    if (escapeNext) {
      escapeNext = false;
    } else if (char === '\\') {
      escapeNext = true;
    } else if (char === '"' && !inString) {
      inString = true;
    } else if (char === '"' && inString) {
      inString = false;
    } else if (!inString) {
      if (char === '[') openBrackets++;
      if (char === ']') openBrackets--;
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;

      // When a separator is found, this indicates the end of a JSON value if we are not inside any array or object
      if (separators.includes(char) && openBrackets === 0 && openBraces === 0) {
        break;
      }
    }
    endIndex++;
  }

  return {
    startIndex,
    endIndex,
    jsonString: input.slice(startIndex, endIndex),
  };
};
export default formatInputPayload;
