const formatWorkflowInputPayload = (
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
  // Split the input by new lines
  const lines = input.split('\n');

  let jsonArray = [];
  let currentJson = '';

  lines.forEach((line) => {
    currentJson += line; // Append the line to the current JSON string

    try {
      // Try to parse the current JSON string
      const jsonObject = JSON.parse(currentJson);
      // If successful, add the object to the array
      jsonArray.push(jsonObject);
      // Reset currentJson for the next JSON object
      currentJson = '';
    } catch (e) {
      // If parsing fails, keep appending lines until we get a valid JSON
    }
  });

  // Handle case where the last JSON object might be malformed
  if (currentJson.trim() !== '') {
    try {
      const jsonObject = JSON.parse(currentJson);
      jsonArray.push(jsonObject);
    } catch (e) {
      //TODO: @assem.hafez add logging here to capture parse issues
      console.error(
        'Error parsing JSON string:',
        currentJson,
        ',Original Input:',
        input
      );
    }
  }

  return jsonArray;
}

export default formatWorkflowInputPayload;
