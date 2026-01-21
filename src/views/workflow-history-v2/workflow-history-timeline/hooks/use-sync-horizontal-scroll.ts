import { useRef } from 'react';

/**
 * This hook keeps the horizontal scroll position synchronized between:
 * - A header timeline viewport (time axis)
 * - Multiple row timeline viewports (event bars)
 *
 * When any element scrolls horizontally, all other elements automatically scroll
 * to the same position, ensuring the event bars and time axis all stay aligned.
 *
 * @param headerTimelineViewportRef - Ref to the header timeline's scrollable viewport
 * @returns Object containing:
 *   - handleScroll: Scroll event handler to attach to each scrollable element
 *   - getRowRefCallback: Function that returns a ref callback for each row
 */
export default function useSyncHorizontalScroll(
  headerTimelineViewportRef: React.RefObject<HTMLDivElement>
) {
  const scrollLeftRef = useRef(0);
  const currentlySyncingElementsRef = useRef<WeakSet<HTMLDivElement>>(
    new WeakSet()
  );
  const timelineViewportRef = useRef<HTMLDivElement | null>(null);
  const rowViewportRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const syncScrollPositions = (
    targetScrollLeft: number,
    sourceElement: HTMLDivElement
  ) => {
    scrollLeftRef.current = targetScrollLeft;

    const elementsToSync: HTMLDivElement[] = [];

    if (
      headerTimelineViewportRef.current &&
      headerTimelineViewportRef.current !== sourceElement &&
      headerTimelineViewportRef.current.scrollLeft !== targetScrollLeft
    ) {
      elementsToSync.push(headerTimelineViewportRef.current);
      currentlySyncingElementsRef.current.add(
        headerTimelineViewportRef.current
      );
    }

    rowViewportRefs.current.forEach((ref) => {
      if (ref && ref !== sourceElement && ref.scrollLeft !== targetScrollLeft) {
        elementsToSync.push(ref);
        currentlySyncingElementsRef.current.add(ref);
      }
    });

    elementsToSync.forEach((el) => {
      el.scrollLeft = targetScrollLeft;
    });

    Promise.resolve().then(() => {
      elementsToSync.forEach((el) => {
        currentlySyncingElementsRef.current.delete(el);
      });
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (currentlySyncingElementsRef.current.has(e.currentTarget)) {
      return;
    }
    const newScrollLeft = e.currentTarget.scrollLeft;
    syncScrollPositions(newScrollLeft, e.currentTarget);
  };

  const getRowRefCallback = (index: number) => (el: HTMLDivElement | null) => {
    if (el) {
      if (index === 0 && timelineViewportRef.current !== el) {
        timelineViewportRef.current = el;
      }
      rowViewportRefs.current.set(index, el);
      if (el.scrollLeft !== scrollLeftRef.current) {
        el.scrollLeft = scrollLeftRef.current;
      }
    } else {
      rowViewportRefs.current.delete(index);
    }
  };

  return {
    handleScroll,
    getRowRefCallback,
  };
}
