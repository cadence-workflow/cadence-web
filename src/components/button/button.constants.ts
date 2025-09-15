export const skeletonLoadingProps = {
  ['aria-label']:
    typeof props.children === 'string'
      ? `loading ${props.children}`
      : 'content is loading',
  ['aria-busy']: true,
  ['aria-live']: 'polite' as const,
  isLoading: false,
  onClick: (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
  },
};
