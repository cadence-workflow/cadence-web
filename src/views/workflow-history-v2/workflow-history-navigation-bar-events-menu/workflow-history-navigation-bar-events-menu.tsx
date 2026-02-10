import { useState, useMemo, useEffect } from 'react';

import { Button } from 'baseui/button';
import { Pagination } from 'baseui/pagination';
import { StatefulPopover } from 'baseui/popover';
import { MdCircle, MdOutlineCircle } from 'react-icons/md';

import workflowHistoryEventFilteringTypeColorsConfig from '../config/workflow-history-event-filtering-type-colors.config';

import { NAVBAR_MENU_ITEMS_PER_PAGE } from './workflow-history-navigation-bar-events-menu.constants';
import {
  styled,
  overrides,
} from './workflow-history-navigation-bar-events-menu.styles';
import { type Props } from './workflow-history-navigation-bar-events-menu.types';

export default function WorkflowHistoryNavigationBarEventsMenu({
  children,
  isUngroupedHistoryView,
  menuItems,
  onClickEvent,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [menuItems.length]);

  const totalPages = Math.ceil(menuItems.length / NAVBAR_MENU_ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * NAVBAR_MENU_ITEMS_PER_PAGE;
    const endIndex = startIndex + NAVBAR_MENU_ITEMS_PER_PAGE;
    return menuItems.slice(startIndex, endIndex);
  }, [menuItems, currentPage]);

  const MenuItemIcon = isUngroupedHistoryView ? MdOutlineCircle : MdCircle;

  return (
    <StatefulPopover
      content={({ close }) => (
        <styled.MenuItemsContainer>
          {paginatedItems.map(({ eventId, label, type }) => (
            <styled.MenuItemContainer key={eventId}>
              <Button
                onClick={() => {
                  onClickEvent(eventId);
                  close();
                }}
                overrides={overrides.button}
                size="compact"
                kind="tertiary"
                startEnhancer={
                  <MenuItemIcon
                    color={
                      workflowHistoryEventFilteringTypeColorsConfig[type]
                        .content
                    }
                  />
                }
              >
                {label}
              </Button>
            </styled.MenuItemContainer>
          ))}
          {totalPages > 1 && (
            <styled.PaginationContainer data-testid="pagination-container">
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
