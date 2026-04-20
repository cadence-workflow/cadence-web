import type React from 'react';

export type Props = {
  id: number;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (id: number) => void;
};
