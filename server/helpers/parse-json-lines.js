// Copyright (c) 2024-2025 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

function parseJsonLines(input) {
  if (!input) {
    return null;
  }

  // Split the input by new lines
  const lines = input.split('\n');

  const jsonArray = [];
  let currentJson = '';

  lines.forEach(line => {
    currentJson += line; // Append the line to the current JSON string

    try {
      // Try to parse the current JSON string
      const jsonObject = JSON.parse(currentJson);

      // If successful, add the object to the array
      jsonArray.push(jsonObject);
      // Reset currentJson for the next JSON object
      currentJson = '';
    } catch {
      // If parsing fails, keep appending lines until we get a valid JSON
    }
  });

  // Handle case where the last JSON object might be malformed
  if (currentJson.trim() !== '') {
    try {
      const jsonObject = JSON.parse(currentJson);

      jsonArray.push(jsonObject);
    } catch {
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

module.exports = parseJsonLines;
