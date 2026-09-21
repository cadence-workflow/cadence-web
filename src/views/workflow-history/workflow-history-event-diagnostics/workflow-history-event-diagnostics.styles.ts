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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: $theme.sizing.scale400,
  })),
  IssueHeaderSection: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: $theme.sizing.scale400,
  })),
  IssueHeaderIconContainer: createStyled('div', {
    flex: 1,
  }),
  IssueHeaderText: createStyled('div', {
    display: 'flex',
    flexDirection: 'column',
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
  } satisfies PanelOverrides,
  button: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        backgroundColor: $theme.colors.bannerActionHighWarning,
      }),
    },
  } satisfies ButtonOverrides,
};
