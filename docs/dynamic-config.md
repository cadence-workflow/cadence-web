# Dynamic Config System

Typed, runtime-configurable values (feature flags and server settings). Entries are registered in `dynamic.config.ts` as either **env** variables (plain strings) or **resolvers** evaluated once at **server start** (cached) or **per request** (with optional args, Zod-validated).

## How entries are evaluated

| Kind                            | When                                    | Args             | Validation                                                                                                     |
| ------------------------------- | --------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------|
| **Env**                         | Startup                                 | —                | Reads `process.env`; result is a string. No resolver, no Zod.                                                  |
| **`evaluateOn: 'serverStart'`** | Once at startup; cached for the process | -                | Resolver runs at boot; return value validated with Zod. Misconfiguration shows failure immediately on startup. |
| **`evaluateOn: 'request'`**     | Every `getConfigValue(key, args)`       | Optional         | Resolver stored at startup; runs per call with `args`; return value validated with Zod.                        |

Startup vs request: **server start** suits static config as fails fast (e.g. cluster topology). **Request** can use information that does not exist at boot (e.g. cluster, auth, user/domain dependant config).

### Extensibility and choosing a kind early

**Design request resolvers for extension.** Most **request** resolvers take **`domain` and `cluster`** in their args type (and Zod schema) even when the default implementation ignores them. That keeps the contract stable so forked deployments can add behavior based on those values without changing resolver signatures or call sites.

**Pick env vs `serverStart` vs `request` deliberately.** Call sites depend on the kind: **`request`** entries need an args object on every `getConfigValue` read; **env** and **`serverStart`** do not.

#### Complexity (low → high)

1. **Env** — string from `process.env`, no resolver.
2. **`serverStart` resolver** — one evaluated value for the process; no per-request args.
3. **`request` resolver** — per call; can take args such as `domain` / `cluster`.

#### When do `getConfigValue` callers need to change?

| Migration | Call sites |
| --------- | ---------- |
| **Env** ↔ **`serverStart`** | Usually **no** change—still process-wide and **no args**. You can swap a plain env read for a boot-time resolver (or the reverse) without revisiting readers. |
| **To or from `request`**, or **changing args** on a request resolver | **Yes**—update every reader: call shape, TypeScript types, and Zod schemas. |

Dropping **`request`** in favor of **env** or **`serverStart`** also removes args and simplifies calls, but that is still a deliberate sweep across the codebase. Plan for the **highest** level of context you are likely to need so you do not paint callers into a corner.

## Files

```
src/config/dynamic/
  dynamic.config.ts                        # Registry — add your entry here
  resolvers/
    <your-config>.ts                       # Resolver function
    <your-config>.types.ts                 # Resolver params type (if args needed)
    schemas/
      resolver-schemas.ts                  # Zod schemas for args + return value
```

## Adding a new entry

Use `CRON_LIST_ENABLED` as a full example.

### Step 1 — Resolver params type (only if the resolver takes args)

Create `src/config/dynamic/resolvers/<your-config>.types.ts`:

```ts
// src/config/dynamic/resolvers/my-feature-enabled.types.ts
export type MyFeatureEnabledResolverParams = {
  domain: string;
  cluster: string;
};
```

If there are no args, skip this file and use `undefined` as the `Args` generic in Step 4.

### Step 2 — Resolver

Create `src/config/dynamic/resolvers/<your-config>.ts`:

```ts
// src/config/dynamic/resolvers/my-feature-enabled.ts
import { type MyFeatureEnabledResolverParams } from './my-feature-enabled.types';

export default async function myFeatureEnabled(
  _: MyFeatureEnabledResolverParams
): Promise<boolean> {
  return process.env.MY_FEATURE_ENABLED?.toLowerCase() === 'true';
}
```

- Return the `ReturnType` you declare; it is checked against the Zod schema at runtime.
- Resolvers run server-side only; `process.env` is safe here.
- No args: use `_?: undefined` or omit the parameter.
- Complex return shapes: see `workflow-actions-enabled.ts`.

### Step 3 — Zod schema

In `src/config/dynamic/resolvers/schemas/resolver-schemas.ts`, add an entry whose key matches the key you will use in `dynamic.config.ts`:

```ts
MY_FEATURE_ENABLED: {
  args: z.object({
    domain: z.string(),
    cluster: z.string(),
  }),
  returnType: z.boolean(),
},
```

No args:

```ts
args: z.undefined(),
```

Complex return type:

```ts
returnType: z.object({
  metadata: z.boolean(),
  issues: z.boolean(),
}),
```

### Step 4 — Register in `dynamic.config.ts`

1. Import the resolver and types (if any):

```ts
import myFeatureEnabled from './resolvers/my-feature-enabled';
import { type MyFeatureEnabledResolverParams } from './resolvers/my-feature-enabled.types';
```

2. Add a typed entry to the `dynamicConfigs` map. Pick a **definition type** from the table below, then fill its generics:

| Type                                                                | Use when                                         |
| ------------------------------------------------------------------- | ------------------------------------------------ |
| `ConfigEnvDefinition`                                               | Plain env var as a string                        |
| `ConfigSyncResolverDefinition<Args, ReturnType, EvalOn, IsPublic>`  | Sync resolver; often `evaluateOn: 'serverStart'` |
| `ConfigAsyncResolverDefinition<Args, ReturnType, EvalOn, IsPublic>` | Async resolver; often `evaluateOn: 'request'`    |

   - **`Args`** — Resolver input type, or `undefined` when there are no args.
   - **`ReturnType`** — Value the resolver produces. For async resolvers, use the resolved type (unwrap `Promise<…>`).
   - **`EvalOn`** — `'serverStart'` if the value is fixed for the process at boot; `'request'` if it is evaluated per call (whenever callers pass args).
   - **`IsPublic`** — `true` exposes the value to the client via `/api/config`; use `false` or omit for server-only keys.


Types are imported from `@/utils/config/config.types`.

Typical async feature flag:

```ts
MY_FEATURE_ENABLED: ConfigAsyncResolverDefinition<
  MyFeatureEnabledResolverParams,
  boolean,
  'request',
  true // isPublic — omit or false for server-only
>;
```

3. Add the runtime value:

```ts
MY_FEATURE_ENABLED: {
  resolver: myFeatureEnabled,
  evaluateOn: 'request',
  isPublic: true,
},
```

## Consuming config

**Server** — `getConfigValue` (route handlers, server components only; throws in the browser):

```ts
import getConfigValue from '@/utils/config/get-config-value';

const withArgs = await getConfigValue('MY_FEATURE_ENABLED', { domain, cluster });
const noArgs = await getConfigValue('WORKFLOW_DIAGNOSTICS_ENABLED');
```

**Client** — only keys with `isPublic: true` are exposed to the browser (the `/api/config` route validates `configKey` against that set). Use **`useConfigValue`** or **`useSuspenseConfigValue`** from `src/hooks/use-config-value/`; they wrap TanStack Query and call `/api/config` (handler: `src/route-handlers/get-config/`).

## Caveats

**Keep resolver imports minimal.** Resolver modules load with the config system. Importing something that calls `getConfigValue` can create a circular dependency. Prefer `process.env`, small helpers, and avoid route handlers, or other config consumers.

**Restart the dev server after changing `dynamic.config.ts`.** New entries and resolver registration apply at process start; hot reload is **not** enough (`npm run dev`).

**Keep Zod `returnType` aligned with the resolver.** `getConfigValue` returns the Zod-parsed value; extra fields are stripped. If the resolver returns `{ enabled: true, mode: 'fast' }` but the schema only has `enabled`, `mode` disappears. Update `resolver-schemas.ts` when return shapes change.

## Validation errors

Bad args or return values throw with a clear message, which helps catch drift between TypeScript and runtime:

```
Failed to parse config 'MY_FEATURE_ENABLED' arguments: Required at "domain"
Failed to parse config 'MY_FEATURE_ENABLED' resolved value: Expected boolean, received string
```
