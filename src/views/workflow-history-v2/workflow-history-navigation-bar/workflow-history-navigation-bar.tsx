import {
  MdArrowDownward,
  MdArrowUpward,
  MdUnfoldLess,
  MdUnfoldMore,
} from 'react-icons/md';

import Button from '@/components/button/button';

import { styled, overrides } from './workflow-history-navigation-bar.styles';
import { type Props } from './workflow-history-navigation-bar.types';

export default function WorkflowHistoryNavigationBar({
  onScrollUp,
  onScrollDown,
  areAllItemsExpanded,
  onToggleAllItemsExpanded,
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
    </styled.NavBarContainer>
  );
}
