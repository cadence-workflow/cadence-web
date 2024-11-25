import { type Theme } from 'baseui';
import { styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const styled = {
  TooltipContentContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    rowGap: $theme.sizing.scale600,
    padding: $theme.sizing.scale700,
  })),
  TooltipHeader: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: $theme.sizing.scale300,
  })),
  TooltipTitle: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelSmall,
    fontWeight: 700,
    lineHeight: '16px',
  })),
  TooltipText: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.ParagraphXSmall,
    lineHeight: '16px',
  })),
  SupportedOperatorsContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    columnGap: $theme.sizing.scale300,
  })),
  SupportedOperator: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.MonoParagraphXSmall,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
    paddingTop: $theme.sizing.scale300,
    paddingBottom: $theme.sizing.scale300,
    paddingLeft: $theme.sizing.scale500,
    paddingRight: $theme.sizing.scale500,
  })),
  QueryContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: $theme.sizing.scale300,
  })),
  QueryLabel: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
  })),
  QueryText: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    ...$theme.typography.MonoParagraphXSmall,
    backgroundColor: $theme.colors.backgroundSecondary,
    borderRadius: $theme.borders.radius300,
    paddingTop: $theme.sizing.scale300,
    paddingBottom: $theme.sizing.scale300,
    paddingLeft: $theme.sizing.scale500,
    paddingRight: $theme.sizing.scale500,
  })),
  LabelContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    columnGap: $theme.sizing.scale200,
    alignItems: 'center',
  })),
};

export const overrides = {
  popover: {
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.backgroundPrimary,
        maxWidth: '600px',
      }),
    },
  } satisfies PopoverOverrides,
  docsLinkButton: {
    BaseButton: {
      style: {
        alignSelf: 'start',
      },
    },
  } satisfies ButtonOverrides,
  copyButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: 'auto',
        width: 'auto',
        alignSelf: 'flex-start',
        padding: $theme.sizing.scale0,
      }),
    },
  } satisfies ButtonOverrides,
};
