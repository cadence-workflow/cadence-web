'use client';
import { createContext, useEffect, useRef } from 'react';

import { useJoyride, ORIGIN } from 'react-joyride';

import getLocalStorageValue from '@/utils/local-storage/get-local-storage-value';
import setLocalStorageValue from '@/utils/local-storage/set-local-storage-value';

import GuidedTourTooltip from '../guided-tour-tooltip/guided-tour-tooltip';

import {
  type GuidedTourContextType,
  type Props,
} from './guided-tour-provider.types';

export const GuidedTourContext = createContext<GuidedTourContextType>(
  {} as GuidedTourContextType
);

function getStorageKey(tourId: string) {
  return `guided-tour:${tourId}`;
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

  const hasAutoStarted = useRef(false);

  useEffect(() => {
    if (autoStart && !hasAutoStarted.current) {
      const completed = getLocalStorageValue(getStorageKey(tourId));

      if (!completed) {
        controls.start();
      }
      hasAutoStarted.current = true;
    }
  }, [autoStart, tourId, controls]);

  useEffect(() => {
    return on('tour:end', () => {
      setLocalStorageValue(getStorageKey(tourId), 'completed');
    });
  }, [on, tourId]);

  return (
    <GuidedTourContext.Provider value={{ controls }}>
      {children}
      {Tour}
    </GuidedTourContext.Provider>
  );
}
