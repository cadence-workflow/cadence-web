'use client';
import React from 'react';

import { styled } from './batch-actions-sidebar-item.styles';
import { type Props } from './batch-actions-sidebar-item.types';

export default function BatchActionsSidebarItem({
  label,
  icon,
  isSelected,
  isActive,
  onSelect,
}: Props) {
  return (
    <styled.ListItem
      $isSelected={isSelected}
      $isActive={isActive}
      onClick={onSelect}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect();
      }}
      role="button"
      tabIndex={0}
    >
      {icon}
      {label}
    </styled.ListItem>
  );
}
