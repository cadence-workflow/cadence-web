import logger from '@/utils/logger';

import losslessJsonParse from '../lossless-json-parse';

import formatBase64Payload from './format-base64-payload';

const separators = ['\n', ' '];

const formatInputPayload = (
  payload: { data?: string | null } | null | undefined
) => {
  const data = payload?.data;
  if (!data) {
    return null;
  }

  const parsedData = formatBase64Payload(data);
  return parseMultipleInputs(parsedData);
};

const parseMultipleInputs = (input: string) => {
  const results = [];
  let currentIndex = 0;

  while (currentIndex < input.length) {
    while (separators.includes(input[currentIndex])) {
      currentIndex++;
    }
    if (currentIndex >= input.length) break;

    try {
      const { startIndex, endIndex, jsonString } = extractJsonValue(
        input,
        currentIndex
      );

      if (endIndex > startIndex) {
        // move to the end of the string before parsing to avoid parsing the same string if the parsing fails
        currentIndex = endIndex;
        results.push(losslessJsonParse(jsonString));
      } else {
        currentIndex++;
      }
    } catch (error) {
      logger.error(
        {
          input,
          currentIndex,
          error,
        },
        'Error parsing JSON string'
      );
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
