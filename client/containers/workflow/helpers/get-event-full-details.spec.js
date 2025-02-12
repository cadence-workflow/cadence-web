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

import getEventFullDetails from './get-event-full-details';

jest.mock('~helpers');

describe('getEventFullDetails', () => {
  describe('When passed no event', () => {
    it('should return what was passed.', () => {
      const output = getEventFullDetails();

      expect(output).toEqual(undefined);
    });
  });

  describe('When passed an event', () => {
    let event;

    beforeEach(() => {
      event = {
        details: {
          key: 'value',
        },
        eventId: 'eventIdValue',
        eventType: 'eventTypeValue',
      };
    });

    it('should return an object with a copy of details.', () => {
      const output = getEventFullDetails({ event });

      expect(output.key).toEqual('value');
    });

    it('should return an object with eventId.', () => {
      const output = getEventFullDetails({ event });

      expect(output.eventId).toEqual('eventIdValue');
    });

    it('should return an object with eventType.', () => {
      const output = getEventFullDetails({ event });

      expect(output.eventType).toEqual('eventTypeValue');
    });

    it('should return an object with kvps.', () => {
      const output = getEventFullDetails({ event });

      expect(output.kvps).toEqual('kvpsMock');
    });
  });
});
