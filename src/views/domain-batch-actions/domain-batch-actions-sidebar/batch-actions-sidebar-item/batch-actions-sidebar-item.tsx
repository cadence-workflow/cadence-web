'use client';
import React from 'react';

import { styled } from './batch-actions-sidebar-item.styles';
import { type Props } from './batch-actions-sidebar-item.types';

export default function BatchActionsSidebarItem({
  id,
  label,
  icon,
  isSelected,
  isActive,
  onSelect,
}: Props) {
  const handleSelect = () => onSelect(id);

  return (
    <styled.ListItem
      $isSelected={isSelected}
      $isActive={isActive}
      onClick={handleSelect}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') handleSelect();
      }}
      role="button"
      tabIndex={0}
    >
      {icon}
      {label}
    </styled.ListItem>
  );
}
