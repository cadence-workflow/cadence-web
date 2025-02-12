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

import getLatestNewsItems from './get-latest-news-items';

describe('getLatestNewsItems', () => {
  const response = {
    items: [
      {
        url: '/_news/news-item-1',
        date_modified: '2020-04-29T00:00:00.000Z',
      },
      {
        url: '/_news/news-item-2',
        date_modified: '2020-04-28T00:00:00.000Z',
      },
      {
        url: '/_news/news-item-3',
        date_modified: '2020-04-27T00:00:00.000Z',
      },
    ],
  };

  it('should return all newsItems from response when newsLastUpdated is undefined.', () => {
    const newsLastUpdated = undefined;
    const output = getLatestNewsItems({ newsLastUpdated, response });

    expect(output).toEqual([
      {
        url: '/news/news-item-1',
        date_modified: '2020-04-29T00:00:00.000Z',
      },
      {
        url: '/news/news-item-2',
        date_modified: '2020-04-28T00:00:00.000Z',
      },
      {
        url: '/news/news-item-3',
        date_modified: '2020-04-27T00:00:00.000Z',
      },
    ]);
  });

  it('should return a subset of newsItems from response when newsLastUpdated is a date before the latest item in the newsItems list.', () => {
    const newsLastUpdated = '2020-04-27T00:00:00.000Z';
    const output = getLatestNewsItems({ newsLastUpdated, response });

    expect(output).toEqual([
      {
        url: '/news/news-item-1',
        date_modified: '2020-04-29T00:00:00.000Z',
      },
      {
        url: '/news/news-item-2',
        date_modified: '2020-04-28T00:00:00.000Z',
      },
    ]);
  });

  it('should return an empty newsItems from response when newsLastUpdated matches the date of the latest item.', () => {
    const newsLastUpdated = '2020-04-29T00:00:00.000Z';
    const output = getLatestNewsItems({ newsLastUpdated, response });

    expect(output).toEqual([]);
  });
});
