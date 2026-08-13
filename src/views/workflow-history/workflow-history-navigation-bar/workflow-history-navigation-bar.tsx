import {
  MdArrowDownward,
  MdArrowUpward,
  MdErrorOutline,
  MdHourglassTop,
  MdUnfoldLess,
  MdUnfoldMore,
} from 'react-icons/md';

import Button from '@/components/button/button';

import WorkflowHistoryNavigationBarEventsMenu from '../workflow-history-navigation-bar-events-menu/workflow-history-navigation-bar-events-menu';

import { styled, overrides } from './workflow-history-navigation-bar.styles';
import { type Props } from './workflow-history-navigation-bar.types';

export default function WorkflowHistoryNavigationBar({
  onScrollUp,
  onScrollDown,
  areAllItemsExpanded,
  onToggleAllItemsExpanded,
  isUngroupedView,
  failedEventsMenuItems,
  pendingEventsMenuItems,
  onClickEvent,
}: Props) {
  return (
    <styled.NavBarContainer>
      <Button
        size="mini"
        kind="tertiary"
        shape="pill"
        overrides={overrides.navActionButton}
        onClick={onToggleAllItemsExpanded}
        aria-label={areAllItemsExpanded ? 'Collapse all' : 'Expand all'}
      >
        {areAllItemsExpanded ? (
          <MdUnfoldLess size={16} />
        ) : (
          <MdUnfoldMore size={16} />
        )}
      </Button>
      <styled.SectionDivider />
      <Button
        size="mini"
        kind="tertiary"
        shape="pill"
        overrides={overrides.navActionButton}
        onClick={onScrollDown}
        aria-label="Scroll down"
      >
        <MdArrowDownward size={16} />
      </Button>
      <Button
        size="mini"
        kind="tertiary"
        shape="pill"
        overrides={overrides.navActionButton}
        onClick={onScrollUp}
        aria-label="Scroll up"
      >
        <MdArrowUpward size={16} />
      </Button>
      {failedEventsMenuItems.length > 0 && (
        <>
          <styled.SectionDivider />
          <WorkflowHistoryNavigationBarEventsMenu
            menuItems={failedEventsMenuItems}
            onClickEvent={onClickEvent}
            isUngroupedHistoryView={isUngroupedView}
          >
            <Button
              size="mini"
              shape="pill"
              overrides={overrides.failedEventsButton}
              startEnhancer={<MdErrorOutline size={12} />}
              aria-label="Failed events"
            >
              {failedEventsMenuItems.length === 1
                ? '1 failed event'
                : `${failedEventsMenuItems.length} failed events`}
            </Button>
          </WorkflowHistoryNavigationBarEventsMenu>
        </>
      )}
      {pendingEventsMenuItems.length > 0 && (
        <>
          <styled.SectionDivider />
          <WorkflowHistoryNavigationBarEventsMenu
            menuItems={pendingEventsMenuItems}
            onClickEvent={onClickEvent}
            isUngroupedHistoryView={isUngroupedView}
          >
            <Button
              size="mini"
              shape="pill"
              overrides={overrides.pendingEventsButton}
              startEnhancer={<MdHourglassTop size={12} />}
              aria-label="Pending events"
            >
              {pendingEventsMenuItems.length === 1
                ? '1 pending event'
                : `${pendingEventsMenuItems.length} pending events`}
            </Button>
          </WorkflowHistoryNavigationBarEventsMenu>
        </>
      )}
    </styled.NavBarContainer>
  );
}
