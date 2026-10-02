import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  saveButton: {
    BaseButton: {
      style: {
        width: '100%',
      } satisfies StyleObject,
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  Page: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: $theme.sizing.scale400,
      minHeight: '100vh',
      boxSizing: 'border-box',
      backgroundColor: $theme.colors.backgroundSecondary,
      paddingTop: $theme.sizing.scale800,
      paddingBottom: $theme.sizing.scale800,
      paddingLeft: $theme.sizing.scale600,
      paddingRight: $theme.sizing.scale600,
    })
  ),
  Notice: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: $theme.sizing.scale400,
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '480px',
      padding: $theme.sizing.scale600,
      borderRadius: $theme.borders.radius400,
      backgroundColor: $theme.colors.negative50,
      ...$theme.typography.LabelMedium,
    })
  ),
  Card: createStyled(
    'main',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: $theme.sizing.scale800,
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '480px',
      padding: $theme.sizing.scale1000,
      borderRadius: $theme.borders.radius400,
      backgroundColor: $theme.colors.backgroundPrimary,
    })
  ),
  Heading: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: $theme.sizing.scale400,
    })
  ),
  Title: createStyled(
    'h1',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.HeadingSmall,
      marginTop: 0,
      marginBottom: 0,
      textAlign: 'center',
    })
  ),
  Description: createStyled(
    'p',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphMedium,
      color: $theme.colors.contentSecondary,
      marginTop: 0,
      marginBottom: 0,
      textAlign: 'center',
    })
  ),
  TokenField: createStyled('div', {
    width: '100%',
  }),
};
