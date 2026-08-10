import { styled as createStyled, type Theme } from 'baseui';
import { type ListOverrides } from 'baseui/dnd-list';
import { type InputOverrides } from 'baseui/input';
import { type PopoverOverrides } from 'baseui/popover';
import { type StyleObject } from 'styletron-react';

export const styled = {
  PopoverContent: createStyled('div', {
    width: '300px',
    maxHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
  }),
  SearchContainer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    paddingLeft: $theme.sizing.scale600,
    paddingRight: $theme.sizing.scale600,
    paddingTop: $theme.sizing.scale500,
    paddingBottom: $theme.sizing.scale400,
  })),
  SubHeader: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: $theme.sizing.scale600,
    paddingRight: $theme.sizing.scale600,
    paddingBottom: $theme.sizing.scale300,
  })),
  SubHeaderLabel: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentTertiary,
  })),
  SubHeaderActions: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    gap: $theme.sizing.scale300,
  })),
  ActionLink: createStyled('button', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.LabelSmall,
    color: $theme.colors.contentTertiary,
    textDecorationLine: 'underline',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    ':hover': {
      textDecoration: 'underline',
    },
  })),
  ColumnsList: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    overflowY: 'auto',
    flex: 1,
    paddingLeft: $theme.sizing.scale200,
    paddingRight: $theme.sizing.scale200,
  })),
  ColumnRow: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: $theme.sizing.scale300,
  })),
  CheckboxContainer: createStyled('div', {
    pointerEvents: 'all',
  }),
  ColumnName: createStyled('span', ({ $theme }: { $theme: Theme }) => ({
    ...$theme.typography.ParagraphSmall,
    display: 'flex',
    alignItems: 'center',
    gap: $theme.sizing.scale200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  })),
  Footer: createStyled('div', ({ $theme }: { $theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: $theme.sizing.scale300,
    paddingLeft: $theme.sizing.scale600,
    paddingRight: $theme.sizing.scale600,
    paddingTop: $theme.sizing.scale500,
    paddingBottom: $theme.sizing.scale500,
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: $theme.colors.borderOpaque,
  })),
};

export const overrides = {
  popover: {
    Body: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        borderTopLeftRadius: $theme.borders.radius400,
        borderTopRightRadius: $theme.borders.radius400,
        borderBottomLeftRadius: $theme.borders.radius400,
        borderBottomRightRadius: $theme.borders.radius400,
        boxShadow: $theme.lighting.shadow600,
      }),
    },
    Inner: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        borderTopLeftRadius: $theme.borders.radius400,
        borderTopRightRadius: $theme.borders.radius400,
        borderBottomLeftRadius: $theme.borders.radius400,
        borderBottomRightRadius: $theme.borders.radius400,
        backgroundColor: $theme.colors.backgroundPrimary,
      }),
    },
  } satisfies PopoverOverrides,
  searchInput: {
    Root: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        height: $theme.sizing.scale950,
      }),
    },
  } satisfies InputOverrides,
  dndList: {
    Item: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        paddingLeft: $theme.sizing.scale400,
        paddingRight: $theme.sizing.scale400,
        paddingTop: $theme.sizing.scale100,
        paddingBottom: $theme.sizing.scale100,
        borderRadius: $theme.borders.radius200,
        ':hover': {
          backgroundColor: $theme.colors.backgroundSecondary,
        },
      }),
    },
    DragHandle: {
      style: ({ $theme }: { $theme: Theme }): StyleObject => ({
        marginRight: $theme.sizing.scale200,
        width: $theme.sizing.scale700,
        minWidth: $theme.sizing.scale700,
      }),
    },
    Label: {
      style: (): StyleObject => ({
        flex: 1,
        minWidth: 0,
      }),
    },
  } satisfies ListOverrides,
  dndListDragDisabled: {
    DragHandle: {
      style: (): StyleObject => ({
        opacity: 0.3,
        pointerEvents: 'none',
        cursor: 'default',
      }),
    },
    Item: {
      style: (): StyleObject => ({
        cursor: 'default',
        pointerEvents: 'none',
        ':hover': {
          borderColor: 'transparent',
          backgroundColor: 'inherit',
        },
      }),
    },
  } satisfies ListOverrides,
};
