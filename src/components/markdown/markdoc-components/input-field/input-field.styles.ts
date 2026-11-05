import { type FormControlOverrides } from 'baseui/form-control';

export const overrides = {
  formControl: {
    ControlContainer: {
      style: {
        maxWidth: '320px',
        marginTop: 0,
        marginBottom: '8px',
      },
    },
  } satisfies FormControlOverrides,
};
