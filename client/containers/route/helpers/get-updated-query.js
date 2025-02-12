// Copyright (c) 2021-2025 Uber Technologies Inc.
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

import isEqual from 'lodash.isequal';

// omits entries from payload with empty string to be removed from original URL query params
// if query and updated query are equal, it will return null.
const getUpdatedQuery = ({ payload, query }) => {
  const omittedKeys = [];
  const omittedPayload = Object.entries(payload).reduce(
    (accumulator, [key, value]) => {
      if (value === '') {
        omittedKeys.push(key);

        return accumulator;
      }

      accumulator[key] = value;

      return accumulator;
    },
    {}
  );

  const omittedQuery = Object.entries(query).reduce(
    (accumulator, [key, value]) => {
      if (omittedKeys.includes(key)) {
        return accumulator;
      }

      accumulator[key] = value;

      return accumulator;
    },
    {}
  );

  const updatedQuery = {
    ...omittedQuery,
    ...omittedPayload,
  };

  if (isEqual(query, updatedQuery)) {
    return null;
  }

  return updatedQuery;
};

export default getUpdatedQuery;
