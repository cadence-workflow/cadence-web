export const CRON_VALIDATE_CADENCE_PRESET_ID = 'cadence';

export const CRON_VALIDATE_CADENCE_PRESET = {
  presetId: CRON_VALIDATE_CADENCE_PRESET_ID,
  useSeconds: false,
  useYears: false,
  useAliases: true,
  useBlankDay: false,
  allowOnlyOneBlankDayField: false,
  allowStepping: true,
  mustHaveBlankDayField: false,
  useLastDayOfMonth: false,
  useLastDayOfWeek: false,
  useNearestWeekday: false,
  useNthWeekdayOfMonth: false,
  seconds: {
    minValue: 0,
    maxValue: 59,
  },
  minutes: {
    minValue: 0,
    maxValue: 59,
  },
  hours: {
    minValue: 0,
    maxValue: 23,
  },
  daysOfMonth: {
    minValue: 1, // starting from 1 instead of 0, 0 is not standard
    maxValue: 31,
  },
  months: {
    minValue: 1, // starting from 1 instead of 0, 0 is not standard
    maxValue: 12,
  },
  daysOfWeek: {
    minValue: 0,
    maxValue: 6, // limiting to 6 instead of 7, 7 is not standard
  },
  years: {
    minValue: 1970,
    maxValue: 2099,
  },
};
