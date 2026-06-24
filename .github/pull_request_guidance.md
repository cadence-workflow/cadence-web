<!-- 1-2 line summary of WHAT changed technically:
- Always link the relevant project's GitHub issue, unless it is a minor bugfix
- Good: "Added workflow search filter component with debounced input #123"
- Bad: "updated component" -->
**What changed?**


<!-- Your goal is to provide all the required context for a future maintainer
to understand the reasons for making this change (see https://cbea.ms/git-commit/#why-not-how).
How did this work previously (and what was wrong with it)? What has changed, and why did you solve it
this way?
- Good: "The workflow list page loaded all workflows upfront and filtered client-side,
  causing significant lag for domains with thousands of workflows. Users reported the page
  becoming unresponsive after ~5 seconds of loading. This change moves filtering to a
  server-side gRPC query with debounced input, reducing initial payload and improving
  perceived responsiveness from ~5s to <200ms."
- Bad: "Improves workflow list" -->
**Why?**


<!-- Include specific test commands and setup. Please include the exact commands such that
another maintainer or contributor can reproduce the test steps taken.
- e.g. Unit test commands with exact invocation
  `npx jest src/views/workflow-list/workflow-list-filters.test.tsx`
- For running the full test suite
  `npm run test`
- For environment-specific tests (browser DOM vs Node.js server)
  `npm run test:unit:browser` or `npm run test:unit:node`
- For UI changes, include manual verification steps
  Example: "Started local dev server with `npm run dev`, navigated to /domains/sample/workflows,
  verified filter input debounces correctly and results update within 200ms"
- Good: Full commands that reviewers can copy-paste to verify
- Bad: "Tested locally" or "Added tests" -->
**How did you test it?**


<!-- If there are risks that the release engineer should know about, document them here.
For example:
- Has the IDL version been bumped? Do the generated types introduce breaking changes?
- Has a shared component been modified? Could it affect other views that use it?
- Is there a bundle size concern? Does this add a significant new dependency?
- Is there an SSR/hydration compatibility issue? Does the change rely on browser-only APIs?
- Has a feature flag been re-used for a new purpose?
- Could this affect accessibility (screen readers, keyboard navigation)?
- If truly N/A, you can mark it as such -->
**Potential risks**


<!-- If this PR completes a user-facing feature or changes functionality, add release notes here.
Your release notes should allow a user and the release engineer to understand the changes with little context.
Always ensure that the description contains a link to the relevant GitHub issue. -->
**Release notes**


<!-- Consider whether this change requires documentation updates
- If yes: mention what needs updating (or link to docs PR) in the README, CONTRIBUTING.md,
  or related documentation
- If in doubt, add a note about potential doc needs
- Only mark N/A if you're certain no docs are affected -->
**Documentation Changes**

