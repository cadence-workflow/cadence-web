import { styled as createStyled } from 'baseui';
import { type ButtonOverrides } from 'baseui/button';

export const overrides = {
  inputButton: {
    Root: {
      style: {
        whiteSpace: 'nowrap',
      },
    },
  } satisfies ButtonOverrides,
};

export const styled = {
  Tile: createStyled<'div', { $isSelected: boolean }>(
    'div',
    ({ $theme, $isSelected }) => ({
      border: '2px solid',
      borderRadius: $theme.sizing.scale500,
      padding: $theme.sizing.scale300,
      display: 'flex',
      flexDirection: 'column',
      rowGap: $theme.sizing.scale300,
      borderColor: $isSelected
        ? $theme.colors.borderSelected
        : $theme.colors.borderOpaque,
    })
  ),
  Header: createStyled('div', {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  Label: createStyled('div', ({ $theme }) => ({
    ...$theme.typography.MonoLabelSmall,
    paddingLeft: $theme.sizing.scale300,
    maxWidth: '240px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  })),
  Actions: createStyled('div', ({ $theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    columnGap: $theme.sizing.scale300,
  })),
};
