# cadence-web — Claude Context

## Project Overview

Next.js 14+ (App Router) web UI for [Cadence Workflow](https://cadenceworkflow.io/). TypeScript throughout. Talks to a Cadence backend over gRPC.

## Key Commands

```bash
npm run dev          # Dev server on :8088
npm run test             # All tests + type tests (85% coverage threshold enforced)
npm run test:unit:browser  # Browser (jsdom) tests only
npm run test:unit:node     # Node (server-side) tests only
npm run lint         # ESLint
npm run typecheck    # tsc --noemit
npm run build        # Production build
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| UI components | [Base Web (baseui)](https://baseweb.design/) — Uber's design system |
| Styling | `baseui`'s `styled()` utility (Styletron under the hood) |
| Data fetching | TanStack Query (React Query v5) with Next.js experimental RSC support |
| Backend protocol | gRPC via `@grpc/grpc-js` |
| Form validation | React Hook Form + Zod |
| Testing | Jest — two separate configs: `browser` (jsdom) and `node` |
| Test utilities | `@testing-library/react`, MSW (Mock Service Worker) for API mocking |
| Type testing | `tstyche` |

## Directory Structure

```
src/
  app/              # Next.js App Router — pages, layouts, error/loading boundaries
    (Home)/         # Route group for main UI pages
    api/            # API route handlers (server-side, call Cadence gRPC)
  components/       # Abstract, reusable UI components (no business logic)
  views/            # Feature modules (complex, page-level components)
    shared/         # Cadence-specific reusable components (has business logic)
  hooks/            # Shared custom React hooks
  providers/        # React context providers
  route-handlers/   # Server-side route handlers
  utils/            # Pure utility functions
  config/           # App configuration
  test-utils/       # Shared test helpers (excluded from coverage)
  __generated__/    # Generated protobuf types — never edit manually
```

## Component vs View/Shared Distinction

**`src/components/`** — Generic UI, no Cadence knowledge:
- Buttons, tables, inputs, layout primitives
- Could be used in any app

**`src/views/shared/`** — Cadence business logic components:
- Components that fetch/render Cadence objects (workflows, domains, etc.)
- Understand Cadence data structures and APIs
- Examples: `WorkflowStatusTag`, `DomainStatusTag`

## File Conventions

Every component/view follows a consistent multi-file pattern:

```
component-name/
  component-name.tsx           # Component implementation
  component-name.styles.ts     # Styletron/baseui styles
  component-name.types.ts      # TypeScript types/interfaces
  __tests__/
    component-name.test.tsx    # Tests
  __fixtures__/                # Test data (excluded from coverage)
```

### Naming
- Files and directories: **kebab-case**
- Components/types: **PascalCase**
- Constants: **UPPER_SNAKE_CASE**
- Functions/variables: **camelCase**
- Path alias: `@/` resolves to `src/`

### Directory Nesting Limits
Max **2 levels** of component directories under `src/views/` and `src/components/`. `__tests__/` at level 3 is fine. Never go deeper.

```
src/views/
  domain-page/               # Level 1 ✓
    domain-page-header/      # Level 2 ✓
      __tests__/             # Level 3 ✓ (tests/fixtures/helpers only)
```

## Config and constants

- **Config** — Values and wiring that **forks are expected to change** between deployments or product variants (clusters, auth, feature visibility, columns).
- **Constants** — **Stable, reusable literals** that are **not** treated as fork overrides (shared labels, fixed format tokens, internal limits used the same way upstream and in forks). Prefer `*.constants.ts`, feature-local modules for cross-cutting fixed values.

## Styling Pattern

Use `baseui`'s `styled` utility — **not** raw Styletron or CSS modules:

```ts
// component.styles.ts
import { styled as createStyled, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export const styled = {
  Container: createStyled('div', ({ $theme }: { $theme: Theme }): StyleObject => ({
    padding: $theme.sizing.scale600,
    color: $theme.colors.contentPrimary,
  })),
};
```

Always use theme tokens: `$theme.sizing.scale*` for spacing, `$theme.colors.*` for colors, `$theme.typography.*` for text.

For responsive styles, use `$theme.mediaQuery.*`:
```ts
{ [$theme.mediaQuery.medium]: { flexDirection: 'row' } }
```

Use `useStyletronClasses` hook for CSS object styles:
```ts
import useStyletronClasses from '@/hooks/use-styletron-classes';
const { cls } = useStyletronClasses(cssStyles);
```

Use `mergeOverrides` from `baseui/helpers/overrides` when extending baseui component overrides.

## TypeScript Conventions

- Prefer `type` over `interface`;
- Use generics with meaningful constraints for reusable components/hooks
- Never use `any` — use `unknown` and narrow
- Always explicitly type hook return values

```ts
export type Props = {
  required: string;
  optional?: number;
};
```

## URL Params and Encoding

Next.js App Router **already decodes** `params` and `searchParams`. Do **not** call `decodeUrlParams()` or `decodeURIComponent()` on values from route handler `params`, page `params`, or `searchParams` — it double-decodes and corrupts values (e.g. task list names with `%` or `@`).

- **Do** use `encodeURIComponent()` when building URLs from user input before `href`, `router.push()`, or `fetch()`.
- `decodeUrlParams()` is only for query string values passed through non-Next mechanisms.

## API Route Handler Pattern

```ts
import { type NextRequest, NextResponse } from 'next/server';
import { getHTTPStatusCode, GRPCError } from '@/utils/grpc/grpc-error';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';
import requestBodySchema from './schemas/request-body-schema';

export async function handlerName(request: NextRequest, requestParams: RequestParams, ctx: Context) {
  const { data, error } = requestBodySchema.safeParse(await request.json());
  if (error) {
    return NextResponse.json({ message: 'Invalid values provided', validationErrors: error.errors }, { status: 400 });
  }

  const params = requestParams.params; // already decoded — do not decode again

  try {
    const response = await ctx.grpcClusterMethods.someMethod({ ...params });
    return NextResponse.json(response);
  } catch (e) {
    logger.error<RouteHandlerErrorPayload>({ requestParams: params, error: e }, 'Error description');
    return NextResponse.json(
      { message: e instanceof GRPCError ? e.message : 'Unexpected error', cause: e },
      { status: getHTTPStatusCode(e) }
    );
  }
}
```

## Testing Patterns

Test type is determined by **file extension**, not directory location:

| Extension | Environment | Run with |
|---|---|---|
| `*.test.ts` / `*.test.tsx` | Browser (jsdom) | `npm run test:unit:browser` |
| `*.node.ts` | Node | `npm run test:unit:node` |

Default to `.test.tsx` unless the code is server-only or uses Node.js APIs.

To run a single file:
```bash
npm run test:unit:browser cron-schedule-input.test.tsx
npm run test:unit:node cron-validate.node.ts
```

### Test imports
Use `@/test-utils/rtl` (not `@testing-library/react` directly) — it wraps with QueryClient, Styletron, and baseui providers:
```ts
import { render, screen, userEvent } from '@/test-utils/rtl';
```

### Setup function pattern
Always use a `setup()` function when multiple tests share initialization:

```ts
describe(ComponentName.name, () => {
  it('renders correctly', () => {
    setup({});
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles clicks', async () => {
    const { user, mockHandler } = setup({});
    await user.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});

function setup(props: Partial<Props> = {}) {
  const mockHandler = jest.fn();
  const user = userEvent.setup();
  render(<ComponentName onAction={mockHandler} {...props} />);
  return { user, mockHandler };
}
```

### Component mocking
Mock child components in unit tests to isolate the parent:

```ts
jest.mock('../child-component', () =>
  function MockChild({ onAction }: any) {
    return <button onClick={onAction}>mock</button>;
  }
);
```

### Other test rules
- MSW is set up globally — use `server.use(...)` for per-test handlers
- `clearTestQueryClient()` runs after each test automatically
- Coverage threshold: **85%** branches, functions, lines, statements — enforced on CI
- Test behavior, not implementation details
- **Fork-friendly assertions** — Do not query or assert on nested **app** components (custom components under `src/`) without mocking them. Forks may swap implementations; tests should assert on **HTML elements** and **third-party UI** (e.g. baseui) only, so parent tests do not break when a child is replaced.
- `__fixtures__/` for test data (excluded from coverage)

## Important Constraints

- **Never edit** `src/__generated__/` — regenerate with `npm run generate:idl`
- `TZ=UTC` is set for all test runs — use UTC in date-related tests

## Common Pitfalls

- **Double-decoding params** — Next.js already decodes route params; calling `decodeURIComponent` again corrupts values with `%` or `@`
- **Using `any`** — use `unknown` and narrow instead
- **Hardcoding style values** — always use `$theme` tokens, never raw px/hex
- **Wrong test import** — import from `@/test-utils/rtl`, not `@testing-library/react`
- **Wrong test extension** — server-side code must use `.node.ts`, not `.test.tsx`
- **Skipping the `setup()` function** — always use one when tests share initialization; don't repeat `render` calls inline
- **Nesting too deep** — max 2 levels under `src/views/` and `src/components/`; `__tests__/` at level 3 only
- **Creating barrel `index.ts` files** — this project does not use them
- **Helpers, types or constants in the component `.tsx`** — add them into their dedicated files.
- 