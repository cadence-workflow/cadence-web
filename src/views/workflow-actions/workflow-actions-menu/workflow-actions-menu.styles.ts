import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const styled = {
  MenuItemsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: $theme.sizing.scale200,
  })),
  MenuItemContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale500,
    alignItems: 'flex-start',
  })),
  MenuItemLabel: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...$theme.typography.LabelSmall,
  })),
  MenuItemSubtitle: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphXSmall,
  })),
};

export const overrides = {
  button: {
    BaseButton: {
      style: {
        justifyContent: 'flex-start',
      } satisfies StyleObject,
    },
  } satisfies ButtonOverrides,
};
