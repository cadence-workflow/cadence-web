import { styled as createStyled } from 'baseui';

export const styled = {
  ViewContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    wordBreak: 'break-word',
    overflow: 'hidden',
    lineHeight: $theme.typography.ParagraphMedium.lineHeight,
  })),
  Paragraph: createStyled('p', ({ $theme }) => ({
    ...$theme.typography.ParagraphMedium,
    marginBottom: $theme.sizing.scale500,
    marginTop: $theme.sizing.scale300,
    ':first-child': {
      marginTop: 0,
    },
    ':last-child': {
      marginBottom: 0,
    },
  })),
  ListItem: createStyled('li', ({ $theme }) => ({
    ...$theme.typography.ParagraphMedium,
    marginBottom: $theme.sizing.scale200,
    ':last-child': {
      marginBottom: 0,
    },
  })),
  Link: createStyled('a', ({ $theme }) => ({
    color: $theme.colors.linkText,
    textDecoration: 'underline',
    ':visited': {
      color: $theme.colors.linkVisited,
    },
    ':hover': {
      color: $theme.colors.linkHover,
    },
  })),
  Strong: createStyled('strong', {
    fontWeight: 'bold',
  }),
  Em: createStyled('em', {
    fontStyle: 'italic',
  }),
  Blockquote: createStyled('blockquote', ({ $theme }) => ({
    margin: `${$theme.sizing.scale600} 0`,
    padding: `${$theme.sizing.scale400} ${$theme.sizing.scale600}`,
    borderLeft: `4px solid ${$theme.colors.borderAccent}`,
    backgroundColor: $theme.colors.backgroundAccentLight,
    borderRadius: $theme.borders.radius200,
  })),
  Hr: createStyled('hr', ({ $theme }) => ({
    border: 'none',
    borderTop: `2px solid ${$theme.colors.backgroundTertiary}`,
    margin: `${$theme.sizing.scale700} 0`,
    width: '100%',
  })),
  Table: createStyled('table', ({ $theme }) => ({
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: $theme.sizing.scale600,
    marginBottom: $theme.sizing.scale600,
    borderRadius: $theme.borders.radius200,
    overflow: 'auto',
  })),
  Th: createStyled('th', ({ $theme }) => ({
    ...$theme.typography.LabelMedium,
    fontWeight: 'bold',
    color: $theme.colors.contentPrimary,
    padding: $theme.sizing.scale400,
    textAlign: 'left',
    border: `1px solid ${$theme.colors.backgroundTertiary}`,
  })),
  Td: createStyled('td', ({ $theme }) => ({
    ...$theme.typography.ParagraphSmall,
    padding: $theme.sizing.scale400,
    textAlign: 'left',
    border: `1px solid ${$theme.colors.backgroundTertiary}`,
  })),
};
