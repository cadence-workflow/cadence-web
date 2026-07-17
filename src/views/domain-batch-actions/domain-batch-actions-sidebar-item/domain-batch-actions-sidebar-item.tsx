'use client';
import React from 'react';

import { styled } from './domain-batch-actions-sidebar-item.styles';
import { type Props } from './domain-batch-actions-sidebar-item.types';

export default function DomainBatchActionsSidebarItem({
  label,
  subLabel,
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
      <span>{icon}</span>
      <styled.TextContainer>
        <span>{label}</span>
        {subLabel && <styled.SubLabel>{subLabel}</styled.SubLabel>}
      </styled.TextContainer>
    </styled.ListItem>
  );
}
