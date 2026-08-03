import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Content: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale300,
    minWidth: '280px',
    maxWidth: '360px',
  })),
  RunEntry: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale200,
    ':not(:last-child)': {
      paddingBottom: $theme.sizing.scale300,
      borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
    },
  })),
  RunHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale300,
  })),
  Status: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: $theme.sizing.scale100,
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentPrimary,
    flexShrink: 0,
  })),
  RunId: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.MonoLabelSmall,
    color: $theme.colors.contentPrimary,
    wordBreak: 'break-all',
  })),
  TimestampRow: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale400,
    ...$theme.typography.ParagraphSmall,
  })),
  TimestampLabel: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentSecondary,
    flexShrink: 0,
  })),
  TimestampValue: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentPrimary,
    textAlign: 'right',
  })),
  BackfillRow: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale400,
    ...$theme.typography.ParagraphSmall,
  })),
};
