import { styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const styled = {
  IssuesContainer: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale400,
    padding: `${$theme.sizing.scale400} ${$theme.sizing.scale0}`,
  })),
  Issue: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale300,
    ':not(:last-child)': {
      borderColor: $theme.borders.border200.borderColor,
      borderStyle: $theme.borders.border200.borderStyle,
      borderBottomWidth: $theme.borders.border200.borderWidth,
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      paddingBottom: $theme.sizing.scale400,
    },
  })),
  IssueIcon: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexShrink: 0,
    color: $theme.colors.contentPrimary,
  })),
  IssueText: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale100,
  })),
  IssueHeading: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.LabelXSmall,
    color: $theme.colors.contentPrimary,
  })),
  IssueCaption: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.ParagraphXSmall,
    color: $theme.colors.contentSecondary,
    lineHeight: $theme.typography.LabelXSmall.lineHeight,
  })),
};

export const overrides = {
  seeMoreButton: {
    BaseButton: {
      style: (): StyleObject => ({
        alignSelf: 'flex-start',
      }),
    },
  } satisfies ButtonOverrides,
};
