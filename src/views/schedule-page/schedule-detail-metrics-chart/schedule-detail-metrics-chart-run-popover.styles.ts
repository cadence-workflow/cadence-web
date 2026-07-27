import { styled as createStyled, type Theme } from 'baseui';

export const styled = {
  Content: createStyled('div', () => ({
    display: 'flex',
    flexDirection: 'column',
    minWidth: '370px',
    maxWidth: '520px',
  })),
  RunEntry: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: $theme.sizing.scale300,
    ':not(:last-child)': {
      marginBottom: $theme.sizing.scale500,
      borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
    },
  })),
  Status: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: $theme.sizing.scale300,
    ...$theme.typography.ParagraphSmall,
    color: $theme.colors.contentPrimary,
  })),
  RunId: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentPrimary,
    wordBreak: 'break-all',
    paddingBottom: $theme.sizing.scale300,
    'a, a:visited': {
      color: $theme.colors.contentPrimary,
      textDecoration: 'none',
    },
    'a:hover': {
      textDecoration: 'underline',
    },
  })),
  DetailRow: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'grid',
    gridTemplateColumns: `minmax(${$theme.sizing.scale2400}, 1fr) 3fr`,
    alignItems: 'center',
    gap: $theme.sizing.scale400,
    ...$theme.typography.ParagraphSmall,
    minHeight: $theme.sizing.scale800,
    borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
    ':last-child': {
      borderBottom: 'none',
    },
  })),
  DetailLabel: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentSecondary,
    flexShrink: 0,
  })),
  DetailValue: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    color: $theme.colors.contentPrimary,
  })),
  LinkContent: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale200,
  })),
};
