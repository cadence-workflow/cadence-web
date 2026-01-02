import { useState, useMemo } from 'react';

import { Button } from 'baseui/button';
import { Pagination } from 'baseui/pagination';
import { StatefulPopover } from 'baseui/popover';

import { type NavigationBarEventsMenuItem } from '../workflow-history-navigation-bar/workflow-history-navigation-bar.types';

import {
  styled,
  overrides,
} from './workflow-history-navigation-bar-events-menu.styles';

const ITEMS_PER_PAGE = 10;

export default function WorkflowHistoryNavigationBarEventsMenu({
  children,
  isUngroupedHistoryView,
  menuItems,
  onClickEvent,
}: {
  children: React.ReactNode;
  isUngroupedHistoryView: boolean;
  menuItems: Array<NavigationBarEventsMenuItem>;
  onClickEvent: (eventId: string) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(menuItems.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return menuItems.slice(startIndex, endIndex);
  }, [menuItems, currentPage]);

  return (
    <StatefulPopover
      content={({ close }) => (
        <styled.MenuItemsContainer>
          {paginatedItems.map(({ eventId, label }) => (
            <styled.MenuItemContainer key={eventId}>
              <Button
                onClick={() => {
                  onClickEvent(eventId);
                  close();
                }}
                size="compact"
                kind="tertiary"
              >
                {label}
              </Button>
            </styled.MenuItemContainer>
          ))}
          {totalPages > 1 && (
            <styled.PaginationContainer>
              <Pagination
                numPages={totalPages}
                currentPage={currentPage}
                onPageChange={({ nextPage }) => {
                  setCurrentPage(nextPage);
                }}
                size="mini"
                overrides={overrides.pagination}
              />
            </styled.PaginationContainer>
          )}
        </styled.MenuItemsContainer>
      )}
      autoFocus={false}
      placement="auto"
      accessibilityType="menu"
    >
      {children}
    </StatefulPopover>
  );
}
