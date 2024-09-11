import { type Theme, styled as createStyled } from 'baseui';
import type { TagKind, TagOverrides } from 'baseui/tag/types';
import { type StyleObject } from 'styletron-react';

export const styled = {
  LabelContainer: createStyled<'div', { $isHighlighted?: boolean }>(
    'div',
    ({
      $theme,
      $isHighlighted,
    }: {
      $theme: Theme;
      $isHighlighted?: boolean;
    }) => ({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: $theme.sizing.scale500,
      ...$theme.typography.LabelSmall,
      ...($isHighlighted && { fontWeight: 700 }),
    })
  ),
};

export const overrides = {
  tag: {
    Root: {
      style: ({
        $theme,
        $kind,
      }: {
        $theme: Theme;
        $kind: TagKind;
      }): StyleObject => ({
        color:
          $kind === 'negative' ? $theme.colors.red700 : $theme.colors.blue700,
        backgroundColor:
          $kind === 'negative' ? $theme.colors.red100 : $theme.colors.blue100,
        height: $theme.sizing.scale700,
        borderRadius: $theme.borders.radius400,
        paddingRight: $theme.sizing.scale300,
        paddingLeft: $theme.sizing.scale300,
        paddingTop: $theme.sizing.scale0,
        paddingBottom: $theme.sizing.scale0,
        margin: 0,
      }),
    },
    Text: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelXSmall,
      }),
    },
  } satisfies TagOverrides,
};
