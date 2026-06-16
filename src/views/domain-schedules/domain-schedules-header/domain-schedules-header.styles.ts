import { styled as createStyled, type Theme } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';
import { type StyleObject } from 'styletron-react';

export const overrides = {
  createScheduleButton: {
    BaseButton: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        width: '100%',
        [$theme.mediaQuery.medium]: {
          width: 'auto',
        },
      }),
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  Container: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      gap: $theme.sizing.scale600,
    })
  ),
  TitleRow: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: $theme.sizing.scale600,
    })
  ),
  Title: createStyled(
    'h2',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      ...$theme.typography.HeadingXSmall,
      color: $theme.colors.contentPrimary,
      marginTop: 0,
      marginBottom: 0,
    })
  ),
  FiltersToolbar: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: $theme.sizing.scale500,
      [$theme.mediaQuery.medium]: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
    })
  ),
  FiltersSlot: createStyled(
    'div',
    (): StyleObject => ({
      flex: 1,
      minWidth: 0,
    })
  ),
  CreateButtonWrap: createStyled(
    'div',
    ({ $theme }: { $theme: Theme }): StyleObject => ({
      alignSelf: 'stretch',
      width: '100%',
      [$theme.mediaQuery.medium]: {
        alignSelf: 'center',
        width: 'auto',
        flexShrink: 0,
      },
    })
  ),
};
