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
  button: {
    BaseButton: {
      style: {
        width: '100%',
        justifyContent: 'flex-start',
      } satisfies StyleObject,
    },
  } satisfies ButtonOverrides,
};
