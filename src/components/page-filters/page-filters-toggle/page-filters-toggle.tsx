import React from 'react';

import { Button, KIND } from 'baseui/button';
import { Filter } from 'baseui/icon';

import { overrides } from './page-filters-toggle.styles';
import { type Props } from './page-filters-toggle.types';

export default function PageFiltersToggle({
  activeFiltersCount,
  onClick,
  isActive,
}: Props) {
  return (
    <Button
      $size="compact"
      kind={isActive ? KIND.primary : KIND.secondary}
      onClick={onClick}
      startEnhancer={<Filter size={16} />}
      overrides={overrides.filtersButton}
    >
      {activeFiltersCount === 0 ? 'Filters' : `Filters (${activeFiltersCount})`}
    </Button>
  );
}
