import { styled as createStyled, type Theme } from 'baseui';
import { type PanelOverrides } from 'baseui/accordion';
import { type StyleObject } from 'styletron-react';

export const styled = {
  IssueHeader: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      gap: $theme.sizing.scale600,
      justifyContent: 'space-between',
    })
  ),
  IssueLabel: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelSmall,
      display: 'flex',
      gap: $theme.sizing.scale500,
      alignItems: 'flex-start',
    })
  ),
  IssueIcon: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      color: $theme.colors.yellow400,
    })
  ),
  IssueActions: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.LabelXSmall,
      display: 'flex',
      gap: $theme.sizing.scale600,
    })
  ),
  DetailsRow: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
      },
      display: 'flex',
      flexDirection: 'row',
      gap: $theme.sizing.scale300,
      flexWrap: 'wrap',
      paddingTop: $theme.sizing.scale400,
      paddingBottom: $theme.sizing.scale400,
      wordBreak: 'break-word',
    })
  ),
  DetailsLabel: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      minWidth: '160px',
      maxWidth: '160px',
      display: 'flex',
      ...$theme.typography.LabelSmall,
      lineHeight: $theme.typography.ParagraphSmall.lineHeight,
    })
  ),
  DetailsValue: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.ParagraphSmall,
    })
  ),
  RootCausesContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      rowGap: $theme.sizing.scale400,
    })
  ),
  RootCauseContainer: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      rowGap: $theme.sizing.scale300,
      ':not(:last-child)': {
        borderBottom: `1px solid ${$theme.colors.borderOpaque}`,
        paddingBottom: $theme.sizing.scale200,
      },
    })
  ),
};

export const overrides = {
  panel: {
    PanelContainer: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        borderWidth: '0px',
        marginTop: $theme.sizing.scale0,
        marginBottom: $theme.sizing.scale0,
      }),
    },
    Header: {
      style: {
        // https://github.com/uber/baseweb/blob/main/src/accordion/styled-components.ts#L50
        // Since the original Panel uses longhand properties, we need to use longhand in overrides
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    Content: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        // https://github.com/uber/baseweb/blob/main/src/accordion/styled-components.ts#L102
        // Since the original Panel uses longhand properties, we need to use longhand in overrides
        paddingTop: $theme.sizing.scale200,
        paddingBottom: $theme.sizing.scale600,
        paddingLeft: $theme.sizing.scale850,
        paddingRight: $theme.sizing.scale700,
        backgroundColor: 'inherit',
      }),
    },
  } satisfies PanelOverrides,
};
