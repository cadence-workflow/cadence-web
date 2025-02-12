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

import getIFrameSrc from './get-iframe-src';

describe('getIFrameSrc', () => {
  const origin = 'http://cadence.com';

  it('should return "http://cadence.com/_news" when only origin is provided.', () => {
    const output = getIFrameSrc({ origin });

    expect(output).toEqual('http://cadence.com/_news');
  });

  it('should return "http://cadence.com/_news/2020/04/30/article-1" when article, date, month, origin, year are provided.', () => {
    const article = 'article-1';
    const date = '30';
    const month = '04';
    const year = '2020';
    const output = getIFrameSrc({ article, date, month, origin, year });

    expect(output).toEqual('http://cadence.com/_news/2020/04/30/article-1');
  });

  it('should return "http://cadence.com/_news/page/2" when navigating to page 2.', () => {
    const year = 'page';
    const month = '2';
    const output = getIFrameSrc({ month, origin, year });

    expect(output).toEqual('http://cadence.com/_news/page/2');
  });
});
