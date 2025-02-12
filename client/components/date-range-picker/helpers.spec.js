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

import moment from 'moment';
import {
  getDateString,
  getMaxEndDate,
  getRange,
  getRangeDisplayText,
  getShortcuts,
  getTimePanelLabel,
  isDateValid,
  isDayDisabled,
} from './helpers';

describe('DateRangePicker helpers', () => {
  describe('getDateString', () => {
    describe('When date = March 10th 2020', () => {
      it('should return "2020-03-10 00:00:00".', () => {
        const date = moment('2020-03-10 00:00:00');
        const output = getDateString(date);

        expect(output).toEqual('2020-03-10 00:00:00');
      });
    });
  });

  describe('getMaxEndDate', () => {
    describe('When moment is set to March 10th 2020', () => {
      beforeEach(() => {
        jest
          .spyOn(Date, 'now')
          .mockImplementation(() => new Date(Date.UTC(2020, 2, 10)).getTime());
      });

      it('should return date = the end of March 10th 2020.', () => {
        const output = getMaxEndDate();

        expect(output.toISOString()).toEqual('2020-03-10T23:59:59.999Z');
      });
    });
  });

  describe('getRange', () => {
    describe('When dateRange = "".', () => {
      it('should return [].', () => {
        const dateRange = '';
        const output = getRange(dateRange);

        expect(output).toEqual([]);
      });
    });

    describe('When dateRange = { startTime: March 9th 2020, endTime: March 10th 2020 }.', () => {
      const dateRange = {
        startTime: moment(new Date(Date.UTC(2020, 2, 9))),
        endTime: moment(new Date(Date.UTC(2020, 2, 10))),
      };

      it('should return range[0] = March 9th 2020.', () => {
        const output = getRange(dateRange);

        expect(output[0].toISOString()).toEqual('2020-03-09T00:00:00.000Z');
      });

      it('should return range[1] = March 10th 2020.', () => {
        const output = getRange(dateRange);

        expect(output[1].toISOString()).toEqual('2020-03-10T00:00:00.000Z');
      });
    });

    describe('When moment is set to March 10th 2020', () => {
      beforeEach(() => {
        jest
          .spyOn(Date, 'now')
          .mockImplementation(() => new Date(Date.UTC(2020, 2, 10)).getTime());
      });

      describe('and dateRange = "last-1-second".', () => {
        const dateRange = 'last-1-second';

        it('should return range[0] = "2020-03-09T23:59:59.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2020-03-09T23:59:59.000Z');
        });

        it('should return range[1] = "2020-03-10T00:00:00.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-10T00:00:00.999Z');
        });
      });

      describe('and dateRange = "last-60-seconds".', () => {
        const dateRange = 'last-60-seconds';

        it('should return range[0] = "2020-03-09T23:59:00.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2020-03-09T23:59:00.000Z');
        });

        it('should return range[1] = "2020-03-10T00:00:00.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-10T00:00:00.999Z');
        });
      });

      describe('and dateRange = "last-1-minute".', () => {
        const dateRange = 'last-1-minute';

        it('should return range[0] = "2020-03-09T23:59:00.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2020-03-09T23:59:00.000Z');
        });

        it('should return range[1] = "2020-03-10T00:00:59.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-10T00:00:59.999Z');
        });
      });

      describe('and dateRange = "last-10-minutes".', () => {
        const dateRange = 'last-10-minutes';

        it('should return range[0] = "2020-03-09T23:50:00.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2020-03-09T23:50:00.000Z');
        });

        it('should return range[1] = "2020-03-10T00:00:59.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-10T00:00:59.999Z');
        });
      });

      describe('and dateRange = "last-1-hour".', () => {
        const dateRange = 'last-1-hour';

        it('should return range[0] = "2020-03-09T23:00:00.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2020-03-09T23:00:00.000Z');
        });

        it('should return range[1] = "2020-03-10T00:59:59.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-10T00:59:59.999Z');
        });
      });

      describe('and dateRange = "last-3-hours".', () => {
        const dateRange = 'last-3-hours';

        it('should return range[0] = "2020-03-09T21:00:00.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2020-03-09T21:00:00.000Z');
        });

        it('should return range[1] = "2020-03-10T00:59:59.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-10T00:59:59.999Z');
        });
      });

      describe('and dateRange = "last-1-day".', () => {
        const dateRange = 'last-1-day';

        it('should return range[0] = "2020-03-09T00:00:00.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2020-03-09T00:00:00.000Z');
        });

        it('should return range[1] = "2020-03-10T23:59:59.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-10T23:59:59.999Z');
        });
      });

      describe('and dateRange = "last-3-days".', () => {
        const dateRange = 'last-3-days';

        it('should return range[0] = "2020-03-07T00:00:00.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2020-03-07T00:00:00.000Z');
        });

        it('should return range[1] = "2020-03-10T23:59:59.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-10T23:59:59.999Z');
        });
      });

      describe('and dateRange = "last-1-month".', () => {
        const dateRange = 'last-1-month';

        it('should return range[0] = "2020-02-01T00:00:00.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2020-02-01T00:00:00.000Z');
        });

        it('should return range[1] = "2020-03-31T23:59:59.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-31T23:59:59.999Z');
        });
      });

      describe('and dateRange = "last-3-months".', () => {
        const dateRange = 'last-3-months';

        it('should return range[0] = "2019-12-01T00:00:00.000Z".', () => {
          const output = getRange(dateRange);

          expect(output[0].toISOString()).toEqual('2019-12-01T00:00:00.000Z');
        });

        it('should return range[1] = "2020-03-31T23:59:59.999Z".', () => {
          const output = getRange(dateRange);

          expect(output[1].toISOString()).toEqual('2020-03-31T23:59:59.999Z');
        });
      });
    });
  });

  describe('getRangeDisplayText', () => {
    describe('When dateRange = ""', () => {
      it('should return "".', () => {
        const dateRange = '';
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('');
      });
    });

    describe('When dateRange = { startTime: March 9th 2020, endTime: March 10th 2020 }.', () => {
      it('should return "2020-03-09 00:00:00 - 2020-03-10 00:00:00".', () => {
        const dateRange = {
          startTime: moment(new Date(2020, 2, 9)),
          endTime: moment(new Date(2020, 2, 10)),
        };
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('2020-03-09 00:00:00 - 2020-03-10 00:00:00');
      });
    });

    describe('When dateRange = "last-1-second"', () => {
      it('should return "Last 1 second".', () => {
        const dateRange = 'last-1-second';
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('Last 1 second');
      });
    });

    describe('When dateRange = "last-10-seconds"', () => {
      it('should return "Last 10 seconds".', () => {
        const dateRange = 'last-10-seconds';
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('Last 10 seconds');
      });
    });

    describe('When dateRange = "last-1-minute"', () => {
      it('should return "Last 1 minute".', () => {
        const dateRange = 'last-1-minute';
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('Last 1 minute');
      });
    });

    describe('When dateRange = "last-10-minutes"', () => {
      it('should return "Last 10 minutes".', () => {
        const dateRange = 'last-10-minutes';
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('Last 10 minutes');
      });
    });

    describe('When dateRange = "last-1-hour"', () => {
      it('should return "Last 1 hour".', () => {
        const dateRange = 'last-1-hour';
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('Last 1 hour');
      });
    });

    describe('When dateRange = "last-3-hours"', () => {
      it('should return "Last 3 hours".', () => {
        const dateRange = 'last-3-hours';
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('Last 3 hours');
      });
    });

    describe('When dateRange = "last-1-day"', () => {
      it('should return "Last 1 day".', () => {
        const dateRange = 'last-1-day';
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('Last 1 day');
      });
    });

    describe('When dateRange = "last-3-days"', () => {
      it('should return "Last 3 days".', () => {
        const dateRange = 'last-3-days';
        const output = getRangeDisplayText(dateRange);

        expect(output).toEqual('Last 3 days');
      });
    });
  });

  describe('getShortcuts', () => {
    describe('When maxDays = 1 and minStartDate is defined', () => {
      const maxDays = 1;
      const minStartDate = {};

      it('should return 4 shortcuts.', () => {
        const output = getShortcuts(maxDays, minStartDate);

        expect(output.length).toEqual(4);
      });

      it('should not contain "Last 24 hours".', () => {
        const output = getShortcuts(maxDays, minStartDate);
        const last24HourOption = output.find(
          option => option.text === 'Last 24 hours'
        );

        expect(last24HourOption).toEqual(undefined);
      });

      it('should return the last option as "Last 1 day".', () => {
        const output = getShortcuts(maxDays, minStartDate);
        const lastOption = output[output.length - 1];

        expect(lastOption.text).toEqual('Last 1 day');
      });
    });

    describe('When maxDays = 3 and minStartDate is defined', () => {
      const maxDays = 3;
      const minStartDate = {};

      it('should return 5 shortcuts.', () => {
        const output = getShortcuts(maxDays, minStartDate);

        expect(output.length).toEqual(5);
      });

      it('should return the last option as "Last 3 days".', () => {
        const output = getShortcuts(maxDays, minStartDate);
        const lastOption = output[output.length - 1];

        expect(lastOption.text).toEqual('Last 3 days');
      });
    });

    describe('When maxDays = 7 and minStartDate is defined', () => {
      const maxDays = 7;
      const minStartDate = {};

      it('should return 6 shortcuts.', () => {
        const output = getShortcuts(maxDays, minStartDate);

        expect(output.length).toEqual(6);
      });

      it('should return the last option as "Last 7 days".', () => {
        const output = getShortcuts(maxDays, minStartDate);
        const lastOption = output[output.length - 1];

        expect(lastOption.text).toEqual('Last 7 days');
      });
    });

    describe('When maxDays = 30 and minStartDate is defined', () => {
      const maxDays = 30;
      const minStartDate = {};

      it('should return 7 shortcuts.', () => {
        const output = getShortcuts(maxDays, minStartDate);

        expect(output.length).toEqual(7);
      });

      it('should return the last option as "Last 30 days".', () => {
        const output = getShortcuts(maxDays, minStartDate);
        const lastOption = output[output.length - 1];

        expect(lastOption.text).toEqual('Last 30 days');
      });
    });

    describe('When maxDays = 90 and minStartDate is defined', () => {
      const maxDays = 90;
      const minStartDate = {};

      it('should return 8 shortcuts.', () => {
        const output = getShortcuts(maxDays, minStartDate);

        expect(output.length).toEqual(8);
      });

      it('should return the last option as "Last 3 months".', () => {
        const output = getShortcuts(maxDays, minStartDate);
        const lastOption = output[output.length - 1];

        expect(lastOption.text).toEqual('Last 3 months');
      });
    });

    describe('When maxDays = 3 and minStartDate = null', () => {
      const maxDays = 3;
      const minStartDate = null;

      it('should return 8 shortcuts', () => {
        const output = getShortcuts(maxDays, minStartDate);

        expect(output.length).toEqual(8);
      });

      it('should return the last option as "Last 3 months".', () => {
        const output = getShortcuts(maxDays, minStartDate);
        const lastOption = output[output.length - 1];

        expect(lastOption.text).toEqual('Last 3 months');
      });
    });
  });

  describe('getTimePanelLabel', () => {
    describe('When showTimePanel = true', () => {
      it('should return "Select date".', () => {
        const showTimePanel = true;
        const output = getTimePanelLabel(showTimePanel);

        expect(output).toEqual('Select date');
      });
    });

    describe('When showTimePanel = false', () => {
      it('should return "Select time".', () => {
        const showTimePanel = false;
        const output = getTimePanelLabel(showTimePanel);

        expect(output).toEqual('Select time');
      });
    });
  });

  describe('isDayDisabled', () => {
    describe('When moment is set to March 10th 2020', () => {
      beforeEach(() => {
        jest
          .spyOn(Date, 'now')
          .mockImplementation(() => new Date(2020, 2, 10).getTime());
      });

      describe('and minStartDate = March 8th 2020', () => {
        let minStartDate;

        beforeEach(() => {
          minStartDate = moment(new Date(2020, 2, 8));
        });

        describe('and date = March 10th 2020', () => {
          it('should return false.', () => {
            const date = new Date(2020, 2, 10);
            const output = isDayDisabled(minStartDate)(date);

            expect(output).toEqual(false);
          });
        });

        describe('and date = March 9th 2020', () => {
          it('should return false.', () => {
            const date = new Date(2020, 2, 9);
            const output = isDayDisabled(minStartDate)(date);

            expect(output).toEqual(false);
          });
        });

        describe('and date = March 8th 2020', () => {
          it('should return false.', () => {
            const date = new Date(2020, 2, 8);
            const output = isDayDisabled(minStartDate)(date);

            expect(output).toEqual(false);
          });
        });

        describe('and date = March 7th 2020', () => {
          it('should return true.', () => {
            const date = new Date(2020, 2, 7);
            const output = isDayDisabled(minStartDate)(date);

            expect(output).toEqual(true);
          });
        });

        describe('and date = March 11th 2020', () => {
          it('should return true.', () => {
            const date = new Date(2020, 2, 11);
            const output = isDayDisabled(minStartDate)(date);

            expect(output).toEqual(true);
          });
        });
      });
    });
  });

  describe('isDateValid', () => {
    let minStartDate, maxEndDate;

    beforeEach(() => {
      minStartDate = moment('2020-03-07 00:00:00');
      maxEndDate = moment('2020-03-10 00:00:00');
    });

    describe('when passing an invalid date', () => {
      it('should return false.', () => {
        const date = { _isValid: false };
        const output = isDateValid(date, minStartDate, maxEndDate);

        expect(output).toEqual(false);
      });
    });

    describe('when passing a date before minStartDate', () => {
      it('should return false.', () => {
        const date = moment('2020-03-06 00:00:00');
        const output = isDateValid(date, minStartDate, maxEndDate);

        expect(output).toEqual(false);
      });
    });

    describe('when passing a date after maxEndDate', () => {
      it('should return false.', () => {
        const date = moment('2020-03-11 00:00:00');
        const output = isDateValid(date, minStartDate, maxEndDate);

        expect(output).toEqual(false);
      });
    });

    describe('when passing a date between minStartDate and maxEndDate', () => {
      it('should return true.', () => {
        const date = moment('2020-03-08 00:00:00');
        const output = isDateValid(date, minStartDate, maxEndDate);

        expect(output).toEqual(true);
      });
    });
  });
});
