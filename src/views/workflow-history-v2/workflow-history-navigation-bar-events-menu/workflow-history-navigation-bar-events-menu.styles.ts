import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type PaginationOverrides } from 'baseui/pagination';
import { type StyleObject } from 'styletron-react';

export const styled = {
  MenuItemsContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: $theme.sizing.scale200,
    backgroundColor: $theme.colors.backgroundPrimary,
    borderRadius: $theme.borders.radius400,
  })),
  MenuItemContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale500,
    alignItems: 'flex-start',
  })),
  PaginationContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: $theme.sizing.scale300,
    paddingTop: $theme.sizing.scale300,
    borderTop: `1px solid ${$theme.colors.borderOpaque}`,
  })),
};

export const overrides = {
  navActionButton: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        paddingTop: $theme.sizing.scale200,
        paddingBottom: $theme.sizing.scale200,
        paddingLeft: $theme.sizing.scale200,
        paddingRight: $theme.sizing.scale200,
      }),
    },
  } satisfies ButtonOverrides,
  pagination: {
    Select: {
      props: {
        overrides: {
          SingleValue: {
            style: ({ $theme }: { $theme: Theme }): StyleObject => ({
              ...$theme.typography.ParagraphXSmall,
            }),
          },
        },
      },
    },
    MaxLabel: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        ...$theme.typography.ParagraphXSmall,
        marginLeft: $theme.sizing.scale200,
      }),
    },
  } satisfies PaginationOverrides,
};
