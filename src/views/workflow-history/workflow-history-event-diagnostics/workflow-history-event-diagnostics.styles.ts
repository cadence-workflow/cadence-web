import { styled as createStyled, type Theme } from 'baseui';
import { type PanelOverrides } from 'baseui/accordion';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: $theme.sizing.scale300,
  })),
  IssueContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphSmall,
    color: $theme.colors.contentPrimary,
    backgroundColor: $theme.colors.backgroundWarningLight,
    padding: $theme.sizing.scale600,
    borderRadius: $theme.borders.radius300,
  })),
  IssueHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: $theme.sizing.scale400,
    [$theme.mediaQuery.medium]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  })),
  IssueHeaderContent: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: $theme.sizing.scale400,
    minWidth: 0,
    flex: 1,
  })),
  IssueHeaderActions: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignSelf: 'flex-end',
    alignItems: 'center',
    columnGap: $theme.sizing.scale400,
    flexShrink: 0,
    [$theme.mediaQuery.medium]: {
      alignSelf: 'center',
    },
  })),
  IssueHeaderIconContainer: createStyled('div', {
    flexShrink: 0,
  }),
  IssueHeaderText: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflowWrap: 'anywhere',
  }),
  IssueType: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    fontWeight: $theme.typography.LabelSmall.fontWeight,
    color: $theme.colors.contentPrimary,
  })),
  IssueReason: createStyled('span', {
    color: 'inherit',
  }),
};

export const overrides = {
  panel: {
    Header: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.ParagraphSmall,
        color: $theme.colors.contentPrimary,
        backgroundColor: $theme.colors.backgroundWarningLight,
        padding: 0,
        minWidth: 0,
      }),
    },
    PanelContainer: {
      style: {
        borderBottom: 'none',
      },
    },
    Content: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.ParagraphSmall,
        color: $theme.colors.contentPrimary,
        backgroundColor: $theme.colors.backgroundWarningLight,
        paddingTop: $theme.sizing.scale400,
        paddingBottom: $theme.sizing.scale400,
        paddingLeft: $theme.sizing.scale850,
      }),
    },
    // hiding the default toggle icon
    ToggleIcon: {
      style: {
        display: 'none',
      },
    },
  } satisfies PanelOverrides,
  button: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.bannerActionHighWarning,
      }),
    },
  } satisfies ButtonOverrides,
};
