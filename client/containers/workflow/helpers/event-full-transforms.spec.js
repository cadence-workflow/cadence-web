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

import { eventFullTransforms } from './event-full-transforms';

describe('eventFullTransforms', () => {
  describe('MarkerRecorded', () => {
    describe('When passed event.markerName === "SideEffect" from Go Client', () => {
      let event;

      beforeEach(() => {
        event = {
          decisionTaskCompletedEventId: 'decisionTaskCompletedEventIdValue',
          details: [
            'sideEffectIdValue',
            'eyAiaGVsbG8iOiAid29ybGQiIH0', // { "hello": "world" }
          ],
          markerName: 'SideEffect',
        };
      });

      it('should return an object with property sideEffectID.', () => {
        const output = eventFullTransforms.MarkerRecorded(event);

        expect(output.sideEffectID).toEqual('sideEffectIdValue');
      });

      it('should return an object with property data.', () => {
        const output = eventFullTransforms.MarkerRecorded(event);

        expect(output.data).toEqual({ hello: 'world' });
      });

      it('should return an object with property decisionTaskCompletedEventId.', () => {
        const output = eventFullTransforms.MarkerRecorded(event);

        expect(output.decisionTaskCompletedEventId).toEqual(
          'decisionTaskCompletedEventIdValue'
        );
      });
    });

    describe('When passed event.markerName === "SideEffect" from Java Client', () => {
      let event;

      beforeEach(() => {
        event = {
          decisionTaskCompletedEventId: 'decisionTaskCompletedEventIdValue',
          details: true,
          header: null,
          markerName: 'SideEffect',
        };
      });

      it('should return true with property data.', () => {
        const output = eventFullTransforms.MarkerRecorded(event);

        expect(output.data).toEqual(true);
      });

      it('should return an object with property decisionTaskCompletedEventId.', () => {
        const output = eventFullTransforms.MarkerRecorded(event);

        expect(output.decisionTaskCompletedEventId).toEqual(
          'decisionTaskCompletedEventIdValue'
        );
      });
    });
  });

  describe('When passed event.markerName !== "SideEffect"', () => {
    let event;

    beforeEach(() => {
      event = {
        decisionTaskCompletedEventId: 'decisionTaskCompletedEventIdValue',
        details: [
          'sideEffectIdValue',
          'eyAiaGVsbG8iOiAid29ybGQiIH0', // { "hello": "world" }
        ],
        markerName: 'NotSideEffect',
      };
    });

    it('should return original event object.', () => {
      const output = eventFullTransforms.MarkerRecorded(event);

      expect(output).toEqual(event);
    });
  });
});
