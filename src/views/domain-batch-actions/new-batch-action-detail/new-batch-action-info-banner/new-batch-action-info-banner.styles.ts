import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  dismissButton: {
    BaseButton: {
      style: {
        backgroundColor: '#DEE9FE',
        ':hover': {
          backgroundColor: '#C9DAFC',
        },
      },
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  Banner: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: $theme.sizing.scale600,
      backgroundColor: '#EFF4FE',
      padding: `${$theme.sizing.scale500} ${$theme.sizing.scale600}`,
      borderRadius: $theme.borders.radius400,
    })
  ),
  Content: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      gap: $theme.sizing.scale600,
      flex: 1,
      minWidth: 0,
    })
  ),
  IconContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: $theme.sizing.scale900,
      color: $theme.colors.contentPrimary,
    })
  ),
  TextContainer: createStyled('div', {
    display: 'flex',
    flexDirection: 'column' as const,
    minWidth: 0,
  }),
  Title: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      color: $theme.colors.contentPrimary,
    })
  ),
  Subtitle: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
      color: $theme.colors.contentSecondary,
    })
  ),
};
