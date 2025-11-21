import { type Theme } from 'baseui';
import { type TagKind, type TagOverrides } from 'baseui/tag';
import { type StyleObject } from 'styletron-react';

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
          $kind === 'primary'
            ? $theme.colors.contentInversePrimary
            : $theme.colors.contentPrimary,
        backgroundColor:
          $kind === 'primary'
            ? $theme.colors.backgroundInversePrimary
            : $theme.colors.backgroundSecondary,
        height: $theme.sizing.scale700,
        borderRadius: $theme.borders.radius200,
        paddingRight: $theme.sizing.scale200,
        paddingLeft: $theme.sizing.scale200,
        paddingTop: $theme.sizing.scale300,
        paddingBottom: $theme.sizing.scale300,
        margin: 0,
      }),
    },
    Text: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.LabelSmall,
      }),
    },
  } satisfies TagOverrides,
};
