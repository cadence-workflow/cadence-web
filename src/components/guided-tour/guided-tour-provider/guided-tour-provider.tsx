'use client';
import { createContext, useContext, useEffect, useRef } from 'react';

import { useJoyride, ORIGIN } from 'react-joyride';

import GuidedTourTooltip from '../guided-tour-tooltip/guided-tour-tooltip';

import {
  type GuidedTourContextType,
  type Props,
} from './guided-tour-provider.types';
import { isTourCompleted, markTourCompleted } from './guided-tour-storage';

export const GuidedTourContext = createContext<GuidedTourContextType | null>(
  null
);

export function useGuidedTour(): GuidedTourContextType {
  const ctx = useContext(GuidedTourContext);
  if (!ctx) {
    throw new Error('useGuidedTour must be used within a GuidedTourProvider');
  }
  return ctx;
}

export default function GuidedTourProvider({
  tourId,
  steps,
  children,
  autoStart = true,
}: Props) {
  const { controls, on, Tour } = useJoyride({
    continuous: true,
    steps,
    tooltipComponent: GuidedTourTooltip,
    onEvent: (data, tourControls) => {
      if (data.origin === ORIGIN.OVERLAY) {
        tourControls.skip();
      }
    },
  });

  const startedTourId = useRef<string | null>(null);

  useEffect(() => {
    if (!autoStart || startedTourId.current === tourId) return;

    if (!isTourCompleted(tourId)) {
      controls.start();
    }
    startedTourId.current = tourId;
  }, [autoStart, tourId, controls]);

  useEffect(() => {
    return on('tour:end', () => {
      markTourCompleted(tourId);
    });
  }, [on, tourId]);

  return (
    <GuidedTourContext.Provider value={{ controls }}>
      {children}
      {Tour}
    </GuidedTourContext.Provider>
  );
}
