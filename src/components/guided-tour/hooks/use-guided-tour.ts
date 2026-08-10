import { useContext } from 'react';

import { GuidedTourContext } from '../guided-tour-provider/guided-tour-provider';
import { type GuidedTourContextType } from '../guided-tour-provider/guided-tour-provider.types';

export default function useGuidedTour(): GuidedTourContextType {
  const ctx = useContext(GuidedTourContext);
  if (!ctx) {
    throw new Error('useGuidedTour must be used within a GuidedTourProvider');
  }
  return ctx;
}
