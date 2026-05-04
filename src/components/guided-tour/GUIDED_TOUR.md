# Guided Tour Components

Reusable components for creating guided product tours using [react-joyride v3](https://github.com/gilbarbara/react-joyride) with BaseUI styling.

## Components

| Component | Path | Purpose |
|-----------|------|---------|
| `GuidedTourProvider` | `@/components/guided-tour/guided-tour-provider` | Wraps a section with tour functionality. Manages `useJoyride`, completion tracking, and auto-starts the tour on first visit. |
| `GuidedTourTooltip` | `@/components/guided-tour/guided-tour-tooltip` | Custom tooltip styled with BaseUI. Used internally by the provider. |
| `useGuidedTour` | `@/components/guided-tour/guided-tour-provider` | Hook that returns the current tour's `controls`. Throws if used outside a `GuidedTourProvider`. |

## Quick Start

### 1. Define your tour steps

Add a config file in your page's `config/` directory:

```ts
// src/views/my-page/config/my-page-tour.config.ts
import { type Step } from 'react-joyride';

const myPageTourConfig: Step[] = [
  {
    target: 'body',
    placement: 'center',
    skipBeacon: true,
    title: 'Welcome!',
    content: 'Let us show you around this page.',
  },
  {
    target: '[data-tour="search-bar"]',
    skipBeacon: true,
    title: 'Search',
    content: 'Use the search bar to find workflows by ID or type.',
  },
  {
    target: '[data-tour="filters"]',
    skipBeacon: true,
    title: 'Filters',
    content: 'Narrow down results using these filters.',
  },
];

export default myPageTourConfig;
```

### 2. Wrap your page with the provider

Add `GuidedTourProvider` in your page's component tree. The tour auto-starts on the user's first visit and won't show again after completion.

```tsx
// src/views/my-page/my-page-context-provider.tsx
import GuidedTourProvider from '@/components/guided-tour/guided-tour-provider/guided-tour-provider';
import myPageTourConfig from '../config/my-page-tour.config';

export default function MyPageContextProvider({ children }) {
  return (
    <GuidedTourProvider tourId="my-page-overview" steps={myPageTourConfig}>
      {children}
    </GuidedTourProvider>
  );
}
```

### 3. Mark target elements

Add `data-tour` attributes to elements you want to highlight:

```tsx
<div data-tour="search-bar">
  <SearchInput />
</div>

<div data-tour="filters">
  <FilterPanel />
</div>
```

That's it. The tour runs automatically on the user's first visit and is remembered in localStorage.

## Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tourId` | `string` | *required* | Unique identifier for completion tracking. Each tour needs its own ID. |
| `steps` | `Step[]` | *required* | Array of react-joyride step objects. |
| `children` | `ReactNode` | *required* | Page content to wrap. |
| `autoStart` | `boolean` | `true` | Auto-start the tour on first visit (when not already completed). Set to `false` to control start timing manually via `useGuidedTour`. |

## Triggering a Tour on a Modal or Specific Event

For tours that should start when a modal opens or a specific action occurs, set `autoStart={false}` and use `useGuidedTour` to start manually:

```tsx
import { useEffect } from 'react';
import { useGuidedTour } from '@/components/guided-tour/guided-tour-provider/guided-tour-provider';

function MyModal({ isOpen }) {
  const { controls } = useGuidedTour();

  useEffect(() => {
    if (isOpen) {
      controls.start();
    }
  }, [isOpen, controls]);

  return <div>...</div>;
}
```

Wrap the modal's parent with the provider:

```tsx
<GuidedTourProvider tourId="my-modal-tour" steps={modalSteps} autoStart={false}>
  <MyModal isOpen={isOpen} />
</GuidedTourProvider>
```

The completion flag still applies — even with manual triggering, the tour only shows once unless the flag is cleared.

## Completion Tracking

All completed tour ids are stored together under a single localStorage key:

```
guided-tour:completed   →   {"my-page-overview": true, "my-modal-tour": true}
```

- On first visit (tour id not in the map), the tour auto-starts.
- When the tour finishes or is skipped, the id is added to the map.
- To reset a single tour, remove its id from the map; to reset all, delete the `guided-tour:completed` key entirely.

## Multiple Tours on One Page

Each tour gets its own `tourId` so completion is tracked independently. **Run only one tour at a time** — under the hood, `useJoyride` appends a global portal (`<div id="react-joyride-portal">`), attaches a document-level Escape listener, and renders a full-screen overlay. Two `RUNNING` tours on the same page would collide on all three.

The two safe patterns are:

### Pattern A — Sibling providers, only one auto-starts at a time

Use `autoStart={false}` on every provider except the one you want to run, and switch which is active based on app state.

```tsx
<GuidedTourProvider tourId="overview" steps={overviewSteps} autoStart={!hasSeenOverview}>
  <Page />
</GuidedTourProvider>

{showFeatureTour && (
  <GuidedTourProvider tourId="new-feature" steps={featureSteps} autoStart={false}>
    <FeatureModal />
  </GuidedTourProvider>
)}
```

### Pattern B — Nested providers for scoped `useGuidedTour()` access

You **can** nest providers — the two tours stay independent for completion tracking — but be aware:

> **Heads up.** Both providers share the same `GuidedTourContext`, so the inner provider shadows the outer one. A child rendered inside the inner provider will only ever get the inner tour's `controls` from `useGuidedTour()`. If a child needs the outer controls, render it between the two providers (above the inner `<GuidedTourProvider>`), or use sibling providers (Pattern A) instead.

```tsx
<GuidedTourProvider tourId="overview" steps={overviewSteps}>
  <OuterControlsTrigger /> {/* useGuidedTour() here → outer controls */}
  <GuidedTourProvider tourId="new-feature" steps={featureSteps} autoStart={false}>
    <InnerControlsTrigger /> {/* useGuidedTour() here → inner controls */}
  </GuidedTourProvider>
</GuidedTourProvider>
```

Even with nesting, only one tour should be `RUNNING` at any moment — start the inner one after the outer ends (e.g., on the inner provider's `tour:end` listener or via a user action).

## Step Configuration Reference

Each step requires `target` and `content`. Common options:

```ts
{
  target: '[data-tour="my-element"]',  // CSS selector, HTMLElement, React ref, or function
  content: 'Description text',         // string or ReactNode
  title: 'Step Title',                 // optional
  placement: 'bottom',                 // bottom (default), top, left, right, center, auto
  skipBeacon: true,                    // skip the pulsing beacon, show tooltip directly
}
```

Use `target: 'body'` with `placement: 'center'` for modal-style steps (welcome/closing screens).

## Targeting Strategies

| Strategy | Example | When to use |
|----------|---------|-------------|
| `data-tour` attribute | `[data-tour="header"]` | Dedicated tour targets, won't break if classes change |
| CSS class | `.my-component` | Element already has a stable class |
| ID | `#sidebar` | Element has a unique ID |
| `data-testid` | `[data-testid="submit-btn"]` | Reuse existing test attributes |

## Tour Behavior

- **Overlay click**: Exits the tour.
- **Close button (X)**: Exits the tour.
- **Next/Back buttons**: Navigate between steps.
- **Escape key**: Closes the current step.
