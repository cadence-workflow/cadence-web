module.exports = {
  paths: [
    {
      name: 'react-input-mask',
      message:
        'Do not import react-input-mask. It uses findDOMNode, which React 19 removed.',
    },
    {
      name: 'baseui/datepicker',
      importNames: [
        'DatePicker',
        'Datepicker',
        'StatefulDatePicker',
        'Datepicker_DO_NOT_USE',
      ],
      message:
        'Do not import this DatePicker. Use @/components/date-time-picker or StatefulCalendar, Calendar, TimePicker, or TimezonePicker. DatepickerOverrides is still allowed for Calendar styling.',
    },
    {
      name: 'baseui/input',
      importNames: ['MaskedInput'],
      message:
        'Do not import MaskedInput. It pulls in react-input-mask, which uses findDOMNode. Use baseui Input instead.',
    },
  ],
  patterns: [
    {
      group: ['baseui/datepicker/*', 'baseui/datepicker/**'],
      message:
        'Do not deep-import baseui/datepicker. Use DateTimePicker or allowed calendar and time exports from baseui/datepicker.',
    },
    {
      group: [
        'baseui/input/masked-input',
        'baseui/input/masked-input/*',
        '**/react-input-mask',
        '**/react-input-mask/*',
      ],
      message:
        'Do not import masked input or react-input-mask. They use findDOMNode, which React 19 removed.',
    },
  ],
};
