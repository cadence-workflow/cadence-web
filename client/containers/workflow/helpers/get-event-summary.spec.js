// Copyright (c) 2022 Uber Technologies Inc.
//
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import getEventSummary from './get-event-summary';

jest.mock('~helpers');

describe('getEventSummary', () => {
  describe('When passed no event', () => {
    it('should return what was passed.', () => {
      const output = getEventSummary({ event: false });

      expect(output).toEqual(false);
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
      const output = getEventSummary({ event });

      expect(output.key).toEqual('value');
    });

    it('should return an object with eventId.', () => {
      const output = getEventSummary({ event });

      expect(output.eventId).toEqual('eventIdValue');
    });

    it('should return an object with eventType.', () => {
      const output = getEventSummary({ event });

      expect(output.eventType).toEqual('eventTypeValue');
    });

    it('should return an object with kvps.', () => {
      const output = getEventSummary({ event });

      expect(output.kvps).toEqual('kvpsMock');
    });
  });
});
