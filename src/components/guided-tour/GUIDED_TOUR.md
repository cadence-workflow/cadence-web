# Guided Tour Components

Reusable components for creating guided product tours using [react-joyride v3](https://github.com/gilbarbara/react-joyride) with BaseUI styling.

## Components

| Component | Path | Purpose |
|-----------|------|---------|
| `GuidedTourProvider` | `@/components/guided-tour/guided-tour-provider` | Wraps a section with tour functionality. Manages `useJoyride`, localStorage completion flags, and auto-starts the tour on first visit. |
| `GuidedTourTooltip` | `@/components/guided-tour/guided-tour-tooltip` | Custom tooltip styled with BaseUI. Used internally by the provider. |

## Quick Start

### 1. Define your tour steps

Create a helper file in your page's `helpers/` directory:

```ts
// src/views/my-page/helpers/get-my-page-tour-steps.ts
import { type Step } from 'react-joyride';

export default function getMyPageTourSteps(): Step[] {
  return [
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
}
```

### 2. Wrap your page with the provider

Add `GuidedTourProvider` in your page's component tree. The tour auto-starts on the user's first visit and won't show again after completion.

```tsx
// src/views/my-page/my-page-context-provider.tsx
import GuidedTourProvider from '@/components/guided-tour/guided-tour-provider/guided-tour-provider';
import getMyPageTourSteps from '../helpers/get-my-page-tour-steps';

export default function MyPageContextProvider({ children }) {
  return (
    <GuidedTourProvider tourId="my-page-overview" steps={getMyPageTourSteps()}>
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

That's it. The tour runs automatically on the user's first visit and is remembered via localStorage.

## Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tourId` | `string` | *required* | Unique identifier for localStorage tracking. Each tour needs its own ID. |
| `steps` | `Step[]` | *required* | Array of react-joyride step objects. |
| `children` | `ReactNode` | *required* | Page content to wrap. |
| `autoStart` | `boolean` | `true` | Auto-start the tour on first visit (when localStorage flag is not set). Set to `false` to control start timing manually via the `GuidedTourContext`. |

## Triggering a Tour on a Modal or Specific Event

For tours that should start when a modal opens or a specific action occurs, set `autoStart={false}` and use the context to start manually:

```tsx
import { useContext, useEffect } from 'react';
import { GuidedTourContext } from '@/components/guided-tour/guided-tour-provider/guided-tour-provider';

function MyModal({ isOpen }) {
  const { controls } = useContext(GuidedTourContext);

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

The localStorage flag still applies — even with manual triggering, the tour only shows once unless the flag is cleared.

## localStorage Flags

Each tour tracks completion independently using the key format:

```
guided-tour:{tourId}
```

- On first visit (no key in localStorage), the tour auto-starts.
- When the tour finishes or is skipped, the key is set to `'completed'`.
- To reset: clear the key from localStorage (e.g., `localStorage.removeItem('guided-tour:my-page-overview')`).

## Multiple Tours on One Page

Use different `tourId` values to run independent tours on the same page. Each tour has its own localStorage flag:

```tsx
<GuidedTourProvider tourId="my-page-overview" steps={overviewSteps}>
  <GuidedTourProvider tourId="my-page-new-feature" steps={featureSteps}>
    {children}
  </GuidedTourProvider>
</GuidedTourProvider>
```

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
