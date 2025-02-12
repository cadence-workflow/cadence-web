// Copyright (c) 2017-2025 Uber Technologies Inc.
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

import { getDatetimeFormattedString } from '~helpers';

export default ({ dateFormat, results, timeFormat, timezone }) =>
  !results
    ? []
    : results.map(
        ({
          closeStatus,
          closeTime,
          domainName,
          execution: { runId, workflowId },
          startTime,
          type: { name },
        }) => ({
          closeStatus,
          closeTime: getDatetimeFormattedString({
            date: closeTime,
            dateFormat,
            timeFormat,
            timezone,
          }),
          domainName,
          runId,
          startTime: getDatetimeFormattedString({
            date: startTime,
            dateFormat,
            timeFormat,
            timezone,
          }),
          workflowId,
          workflowName: name,
        })
      );
