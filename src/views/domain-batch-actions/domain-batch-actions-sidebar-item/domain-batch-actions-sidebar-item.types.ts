import type React from 'react';

export type Props = {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  isActive: boolean;
  onSelect: () => void;
};
