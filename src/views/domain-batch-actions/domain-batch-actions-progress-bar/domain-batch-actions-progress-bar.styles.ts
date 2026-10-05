import { styled as createStyled, type Theme } from 'baseui';
import { type ProgressBarOverrides } from 'baseui/progress-bar';

export const overrides = {
  progressBar: {
    Label: {
      style: ({ $theme }: { $theme: Theme }) => ({
        ...$theme.typography.LabelMedium,
        color: $theme.colors.contentPrimary,
      }),
    },
  } satisfies ProgressBarOverrides,
};

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: $theme.sizing.scale300,
  })),
  Label: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    columnGap: $theme.sizing.scale600,
    rowGap: $theme.sizing.scale200,
  })),
  LabelText: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentPrimary,
  })),
  Stat: createStyled<'span', { $muted?: boolean }>(
    'span',
    ({ $theme, $muted }) => ({
      ...$theme.typography.LabelSmall,
      color: $muted
        ? $theme.colors.contentStateDisabled
        : $theme.colors.contentPrimary,
      display: 'inline-flex',
      alignItems: 'center',
      gap: $theme.sizing.scale200,
    })
  ),
};
