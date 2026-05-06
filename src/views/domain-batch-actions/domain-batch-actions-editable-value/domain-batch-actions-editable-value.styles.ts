import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const styled = {
  Container: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    ...$theme.typography.LabelSmall,
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: $theme.sizing.scale300,
  })),
};

export const overrides = {
  editButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }) => ({
        borderRadius: $theme.borders.radius200,
      }),
    },
  } satisfies ButtonOverrides,
};
