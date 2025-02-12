// Copyright (c) 2022-2025 Uber Technologies Inc.
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

const btoa = require('btoa');
const Long = require('long');
const cliTransform = require('./cli-transform');

describe('cliTransform', () => {
  it('should return null when passed null.', () => {
    const output = cliTransform(null);

    expect(output).toEqual(null);
  });

  it('should return a string when passed a string.', () => {
    const output = cliTransform('hello world');

    expect(output).toEqual('hello world');
  });

  it('should convert an object with a key "input" to base64 string.', () => {
    const expectedOutput = {
      input:
        'eyJlbWFpbHMiOlsiamFuZUBleGFtcGxlLmNvbSIsImJvYkBleGFtcGxlLmNvbSJdLCJpbmNsdWRlRm9vdGVyIjp0cnVlfQ==',
    };
    const input = {
      input: btoa(
        JSON.stringify({
          emails: ['jane@example.com', 'bob@example.com'],
          includeFooter: true,
        })
      ),
    };
    const output = cliTransform(input);

    expect(output).toEqual(expectedOutput);
  });

  it('should convert an object with value type of long to lossless number.', () => {
    const expectedOutput = {
      timestamp: {
        isLosslessNumber: true,
        type: 'LosslessNumber',
        value: '1510701867531262273',
      },
    };
    const input = {
      timestamp: new Long(800610625, 351737688, false),
    };
    const output = cliTransform(input);

    expect(output).toEqual(expectedOutput);
  });

  it('should convert an object with value of Buffer to base64 string.', () => {
    const expectedOutput = {
      buffer:
        'eyJlbWFpbHMiOlsiamFuZUBleGFtcGxlLmNvbSIsImJvYkBleGFtcGxlLmNvbSJdLCJpbmNsdWRlRm9vdGVyIjp0cnVlfQ==',
    };
    const input = {
      buffer: Buffer.from(
        JSON.stringify({
          emails: ['jane@example.com', 'bob@example.com'],
          includeFooter: true,
        })
      ),
    };
    const output = cliTransform(input);

    expect(output).toEqual(expectedOutput);
  });

  it('should parse an array of an object.', () => {
    const expectedOutput = {
      innerArray: [
        {
          input:
            'eyJlbWFpbHMiOlsiamFuZUBleGFtcGxlLmNvbSIsImJvYkBleGFtcGxlLmNvbSJdLCJpbmNsdWRlRm9vdGVyIjp0cnVlfQ==',
        },
      ],
    };
    const input = {
      innerArray: [
        {
          input: btoa(
            JSON.stringify({
              emails: ['jane@example.com', 'bob@example.com'],
              includeFooter: true,
            })
          ),
        },
      ],
    };
    const output = cliTransform(input);

    expect(output).toEqual(expectedOutput);
  });

  it('should parse sub objects of an object.', () => {
    const expectedOutput = {
      innerObject: {
        input:
          'eyJlbWFpbHMiOlsiamFuZUBleGFtcGxlLmNvbSIsImJvYkBleGFtcGxlLmNvbSJdLCJpbmNsdWRlRm9vdGVyIjp0cnVlfQ==',
      },
    };
    const input = {
      innerObject: {
        input: btoa(
          JSON.stringify({
            emails: ['jane@example.com', 'bob@example.com'],
            includeFooter: true,
          })
        ),
      },
    };
    const output = cliTransform(input);

    expect(output).toEqual(expectedOutput);
  });

  it("should remove a key from an object if it's value is null.", () => {
    const expectedOutput = {};
    const input = {
      deletedParam: null,
    };
    const output = cliTransform(input);

    expect(output).toEqual(expectedOutput);
  });
});
