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

import { ONE_HOUR_IN_MILLISECONDS } from '../constants';
import CacheManager from './cache-manager';

describe('cacheManager', () => {
  describe('get', () => {
    let cacheManager;

    beforeEach(() => {
      cacheManager = new CacheManager(ONE_HOUR_IN_MILLISECONDS);
    });

    describe('cache = null', () => {
      it('should call fetchCallback.', async () => {
        const mockData = {
          hello: 'world',
        };
        const fetchCallback = jest.fn().mockImplementation(() => mockData);

        const data = await cacheManager.get(fetchCallback);

        expect(fetchCallback).toHaveBeenCalled();
        expect(data.hello).toEqual('world');
      });
    });

    describe('cache is set', () => {
      it('should return cache on the second attempt and not call fetchCallback twice.', async () => {
        const mockData = {
          hello: 'world',
        };
        const fetchCallback1 = jest.fn().mockImplementation(() => mockData);

        const data1 = await cacheManager.get(fetchCallback1);

        const updatedMockData = {
          foo: 'bar',
        };
        const fetchCallback2 = jest
          .fn()
          .mockImplementation(() => updatedMockData);

        const data2 = await cacheManager.get(fetchCallback2);

        expect(fetchCallback1).toHaveBeenCalled();
        expect(fetchCallback2).not.toHaveBeenCalled();
        expect(data1.hello).toEqual('world');
        expect(data2.hello).toEqual('world');
        expect(data2.foo).toEqual(undefined);
      });

      describe('and time passes over ONE_HOUR_IN_MILLISECONDS', () => {
        it('should call the second fetchCallback and return data.', async () => {
          const mockData = {
            hello: 'world',
          };
          const fetchCallback1 = jest.fn().mockImplementation(() => mockData);

          // set current time
          jest
            .spyOn(Date, 'now')
            .mockImplementation(() =>
              new Date(Date.UTC(2020, 2, 10)).getTime()
            );

          const data1 = await cacheManager.get(fetchCallback1);

          const updatedMockData = {
            foo: 'bar',
          };
          const fetchCallback2 = jest
            .fn()
            .mockImplementation(() => updatedMockData);

          // set current time to an hour into the future
          jest
            .spyOn(Date, 'now')
            .mockImplementation(() =>
              new Date(Date.UTC(2020, 2, 10, 2)).getTime()
            );

          const data2 = await cacheManager.get(fetchCallback2);

          expect(fetchCallback1).toHaveBeenCalled();
          expect(fetchCallback2).toHaveBeenCalled();
          expect(data1.hello).toEqual('world');
          expect(data2.hello).toEqual(undefined);
          expect(data2.foo).toEqual('bar');
        });
      });
    });
  });
});
