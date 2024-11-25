import losslessJsonParse from '../lossless-json-parse';

const formatPayload = (
  payload: { data?: string | null } | null | undefined
) => {
  const data = payload?.data;

  if (!data) {
    return null;
  }

  const parsedData = atob(data);

  // try parsing as JSON
  try {
    return losslessJsonParse(parsedData);
  } catch {
    // remove double quotes from the string
    const formattedString = parsedData.replace(/"/g, '');

    // check if it is in an Array format
    if (formattedString.includes('\n')) {
      return formattedString.split('\n').filter(Boolean);
    }

    // otherwise return as a String
    return formattedString;
  }
};

export default formatPayload;
