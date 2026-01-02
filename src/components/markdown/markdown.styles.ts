import { styled as createStyled } from 'baseui';

export const styled = {
  ViewContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    wordBreak: 'break-word',
    overflow: 'hidden',
    lineHeight: $theme.typography.ParagraphMedium.lineHeight,

    // Headings
    '& h1': {
      ...$theme.typography.HeadingXXLarge,
      marginTop: $theme.sizing.scale800,
      marginBottom: $theme.sizing.scale600,
      borderBottom: `1px solid ${$theme.colors.backgroundTertiary}`,
      paddingBottom: $theme.sizing.scale300,
    },
    '& h2': {
      ...$theme.typography.HeadingXLarge,
      marginTop: $theme.sizing.scale700,
      marginBottom: $theme.sizing.scale500,
      borderBottom: `1px solid ${$theme.colors.backgroundTertiary}`,
      paddingBottom: $theme.sizing.scale200,
    },
    '& h3': {
      ...$theme.typography.HeadingLarge,
      marginTop: $theme.sizing.scale600,
      marginBottom: $theme.sizing.scale400,
    },
    '& h4': {
      ...$theme.typography.HeadingMedium,
      marginTop: $theme.sizing.scale500,
      marginBottom: $theme.sizing.scale300,
    },
    '& h5': {
      ...$theme.typography.HeadingSmall,
      marginTop: $theme.sizing.scale400,
      marginBottom: $theme.sizing.scale300,
    },
    '& h6': {
      ...$theme.typography.HeadingXSmall,
      marginTop: $theme.sizing.scale400,
      marginBottom: $theme.sizing.scale300,
    },

    // Paragraphs
    '& p': {
      ...$theme.typography.ParagraphMedium,
      marginBottom: $theme.sizing.scale500,
      marginTop: $theme.sizing.scale300,
      '&:first-child': {
        marginTop: 0,
      },
      '&:last-child': {
        marginBottom: 0,
      },
    },

    // Lists
    '& ul, & ol': {
      marginBottom: $theme.sizing.scale500,
      marginTop: $theme.sizing.scale300,
      paddingLeft: $theme.sizing.scale700,
      '&:first-child': {
        marginTop: 0,
      },
      '&:last-child': {
        marginBottom: 0,
      },
    },
    '& ul': {
      listStyleType: 'disc',
    },
    '& ol': {
      listStyleType: 'decimal',
    },
    '& li': {
      ...$theme.typography.ParagraphMedium,
      marginBottom: $theme.sizing.scale200,
      '&:last-child': {
        marginBottom: 0,
      },
      '& > p': {
        marginTop: 0,
        marginBottom: $theme.sizing.scale200,
        '&:last-child': {
          marginBottom: 0,
        },
      },
    },
    '& ul ul, & ol ol, & ul ol, & ol ul': {
      marginTop: $theme.sizing.scale200,
      marginBottom: $theme.sizing.scale200,
    },

    // Links
    '& a': {
      color: $theme.colors.linkText,
      textDecoration: 'underline !important',
      ':hover': {
        color: $theme.colors.linkHover,
        textDecoration: 'underline !important',
      },
      ':visited': {
        color: $theme.colors.linkVisited,
      },
    },

    // Emphasis
    '& strong': {
      fontWeight: 'bold',
    },
    '& em': {
      fontStyle: 'italic',
    },

    // Code
    '& code': {
      ...$theme.typography.MonoLabelSmall,
      backgroundColor: $theme.colors.backgroundTertiary,
      padding: `${$theme.sizing.scale100} ${$theme.sizing.scale200}`,
      borderRadius: $theme.borders.radius200,
      border: `1px solid ${$theme.colors.backgroundTertiary}`,
      fontSize: '0.875em',
    },
    '& pre': {
      marginBottom: $theme.sizing.scale600,
      marginTop: $theme.sizing.scale600,
      backgroundColor: $theme.colors.backgroundTertiary,
      padding: $theme.sizing.scale500,
      borderRadius: $theme.borders.radius300,
      border: `1px solid ${$theme.colors.backgroundTertiary}`,
      overflow: 'auto',
      '& code': {
        ...$theme.typography.MonoLabelMedium,
        backgroundColor: 'transparent',
        padding: 0,
        border: 'none',
        fontSize: 'inherit',
      },
    },

    // Blockquotes
    '& blockquote': {
      margin: `${$theme.sizing.scale600} 0`,
      padding: `${$theme.sizing.scale400} ${$theme.sizing.scale600}`,
      borderLeft: `4px solid ${$theme.colors.borderAccent}`,
      backgroundColor: $theme.colors.backgroundAccentLight,
      borderRadius: $theme.borders.radius200,
      '& > p': {
        marginTop: 0,
        marginBottom: $theme.sizing.scale300,
        '&:last-child': {
          marginBottom: 0,
        },
      },
      '& > p:first-child': {
        fontStyle: 'italic',
        color: $theme.colors.contentSecondary,
      },
    },

    // Horizontal Rules
    '& hr': {
      border: 'none',
      borderTop: `2px solid ${$theme.colors.backgroundTertiary}`,
      margin: `${$theme.sizing.scale700} 0`,
      width: '100%',
    },

    // Images
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      marginTop: $theme.sizing.scale400,
      marginBottom: $theme.sizing.scale400,
      borderRadius: $theme.borders.radius200,
      border: `1px solid ${$theme.colors.backgroundTertiary}`,
    },

    // Tables
    '& table': {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: $theme.sizing.scale600,
      marginBottom: $theme.sizing.scale600,
      borderRadius: $theme.borders.radius200,
      overflow: 'auto',
    },
    '& th, & td': {
      ...$theme.typography.ParagraphSmall,
      padding: $theme.sizing.scale400,
      textAlign: 'left',
      border: `1px solid ${$theme.colors.backgroundTertiary}`,
    },
    '& th': {
      ...$theme.typography.LabelMedium,
      fontWeight: 'bold',
      color: $theme.colors.contentPrimary,
    },
    // Task Lists (if supported)
    '& input[type="checkbox"]': {
      marginRight: $theme.sizing.scale300,
      cursor: 'pointer',
    },
    '& li.task-list-item': {
      listStyleType: 'none',
    },

    // Delete
    '& del': {
      textDecoration: 'line-through',
      color: $theme.colors.contentTertiary,
    },
  })),
};
