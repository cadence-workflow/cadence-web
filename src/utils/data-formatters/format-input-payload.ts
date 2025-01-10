import logger from '@/utils/logger';

import losslessJsonParse from '../lossless-json-parse';
const formatInputPayload = (
  payload: { data?: string | null } | null | undefined
) => {
  const data = payload?.data;

  if (!data) {
    return null;
  }

  const parsedData = atob(data);
  return parseJsonLines(parsedData);
};

function parseJsonLines(input: string) {
  const jsonArray = [];
  let currentJson = '';
  const separators = ['\n', ' '];

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (separators.includes(char)) {
      // Try to parse the current JSON string
      if (currentJson) {
        try {
          const jsonObject = losslessJsonParse(currentJson);
          // If successful, add the object to the array
          jsonArray.push(jsonObject);
          // Reset currentJson for the next JSON object
          currentJson = '';
        } catch {
          // If parsing fails, treat the separator as part of the currentJson and continue with the next char
          currentJson += char;
        }
      }
    } else {
      currentJson += char;
    }
  }

  // Handle case where the last JSON object might be malformed
  if (currentJson.trim() !== '') {
    try {
      const jsonObject = losslessJsonParse(currentJson);
      jsonArray.push(jsonObject);
    } catch {
      logger.error(
        {
          input,
          currentJson,
        },
        'Error parsing JSON string'
      );
    }
  }

  return jsonArray;
}

export default formatInputPayload;
