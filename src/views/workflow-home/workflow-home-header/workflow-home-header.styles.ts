import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Header: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: $theme.sizing.scale600,
      paddingTop: $theme.sizing.scale600,
    })
  ),
  Title: createStyled(
    'h1',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.HeadingSmall,
      color: $theme.colors.contentPrimary,
      margin: 0,
      minWidth: 0,
      overflowWrap: 'anywhere',
    })
  ),
};

export const overrides = {
  refreshButton: {
    BaseButton: {
      style: { flexShrink: 0 },
    },
  } satisfies ButtonOverrides,
};
