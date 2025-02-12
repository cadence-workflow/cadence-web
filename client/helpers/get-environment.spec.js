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

import getEnvironment from './get-environment';

describe('getEnvironment', () => {
  const LOCALHOST_DOMAIN = 'http://localhost:8088';
  const LOCALHOST_OPTION = {
    label: 'Localhost',
    value: LOCALHOST_DOMAIN,
  };

  const UNKNOWN_DOMAIN = 'http://unknown.domain.com';
  const UNKNOWN_OPTION = {
    label: 'Unknown',
    value: UNKNOWN_DOMAIN,
  };

  const ENVIRONMENT_LIST = [LOCALHOST_OPTION];

  it('should return UNKNOWN_OPTION when origin = UNKNOWN_DOMAIN and is not part of environmentList.', () => {
    const output = getEnvironment({
      environmentList: ENVIRONMENT_LIST,
      origin: UNKNOWN_DOMAIN,
    });

    expect(output).toEqual(UNKNOWN_OPTION);
  });

  it('should return LOCALHOST_OPTION when origin = LOCALHOST_DOMAIN and environmentList = [LOCALHOST_OPTION].', () => {
    const output = getEnvironment({
      environmentList: ENVIRONMENT_LIST,
      origin: LOCALHOST_DOMAIN,
    });

    expect(output).toEqual(LOCALHOST_OPTION);
  });
});
