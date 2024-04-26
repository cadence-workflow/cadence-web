export type Props = {
  canLoadMoreResults: boolean;
  hasSearchResults: boolean;
  infiniteScrollTargetRef:
    | React.MutableRefObject<HTMLDivElement | null>
    | ((node?: Element | null | undefined) => void);
};
