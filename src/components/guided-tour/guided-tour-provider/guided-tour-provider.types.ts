import { type Controls, type Step } from 'react-joyride';

export type GuidedTourContextType = {
  controls: Controls;
};

export type Props = {
  tourId: string;
  steps: Step[];
  children: React.ReactNode;
  autoStart?: boolean;
};
