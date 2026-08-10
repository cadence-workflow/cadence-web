import { type Step } from 'react-joyride';

const welcomeStep: Step = {
  target: 'body',
  placement: 'center',
  skipBeacon: true,
  title: 'Batch actions',
  content:
    'Run the same action — like terminate, cancel, reset or signal — across many workflows at once. Here is a quick tour.',
};

const newActionStep: Step = {
  target: '[data-tour="batch-new-action-button"]',
  placement: 'right',
  skipBeacon: true,
  title: 'Draft a new batch action',
  content:
    'Start here. Create a draft, pick the workflows to target, then choose what to do with them.',
};

const historyStep: Step = {
  target: '[data-tour="batch-history"]',
  placement: 'right',
  skipBeacon: true,
  title: 'Track your batch actions',
  content:
    'In-progress and past batch actions show up here. Select one to see its status and progress.',
};

// Overview tour — auto-starts on first visit to the Batch actions tab.
// When there is no history yet, only the welcome + entry-point steps apply
// (the history list is not rendered).
export const domainBatchActionsOverviewTourConfig: Step[] = [
  welcomeStep,
  newActionStep,
  historyStep,
];

export const domainBatchActionsOverviewEmptyTourConfig: Step[] = [
  welcomeStep,
  newActionStep,
];

// Draft tour — auto-starts when a new draft is opened, where the form and the
// Select/Query toggle actually exist in the DOM.
export const domainBatchActionsDraftTourConfig: Step[] = [
  {
    target: '[data-tour="batch-draft-params"]',
    placement: 'bottom',
    skipBeacon: true,
    title: 'Set up your action',
    content:
      'Give the batch action a description and set an RPS limit to control how fast it runs.',
  },
  {
    target: '[data-tour="batch-input-toggle"]',
    placement: 'bottom',
    skipBeacon: true,
    title: 'Choose your targets',
    content:
      'Use Select to pick workflows one by one, or switch to Query to match many workflows with a search query.',
  },
];
