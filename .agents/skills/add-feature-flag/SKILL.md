---
name: add-feature-flag
description: Add a new boolean feature flag (dynamic config key) to cadence-web. Use when asked to add, create, or set up a feature flag, config flag, or `*_ENABLED` toggle.
---

# Add a feature flag

Feature flags are dynamic config entries whose resolver returns `boolean`. Completeness is enforced by TypeScript — the fixture and the Zod schema map are typed against `dynamicConfigs`, so a missing entry fails `npm run typecheck`.

Reference example: `WORKFLOW_DIAGNOSTICS_ENABLED` (added in the same 4 files below).

## Naming

- Key: `UPPER_SNAKE_CASE`, ending in `_ENABLED` — e.g. `WORKFLOW_DIAGNOSTICS_ENABLED`
- Env var: `CADENCE_` + key — e.g. `CADENCE_WORKFLOW_DIAGNOSTICS_ENABLED`
- Resolver file: kebab-case of the key — e.g. `workflow-diagnostics-enabled.ts`
- Resolver function: camelCase of the key — e.g. `workflowDiagnosticsEnabled`

## Files to touch

Add the new entry directly after a related existing flag in each file (not alphabetically).

### 1. Resolver — `src/config/dynamic/resolvers/<flag-name>.ts`

```ts
/**
 * Returns whether <feature> is enabled.
 *
 * To enable, set the CADENCE_<FLAG_NAME> env variable to `true`.
 * For further customization, override the implementation of this resolver.
 *
 * @returns {Promise<boolean>} Whether <feature> is enabled.
 */
export default async function <flagName>(): Promise<boolean> {
  return process.env.CADENCE_<FLAG_NAME> === 'true';
}
```

- Default export, `async`, returns `Promise<boolean>`.
- Off by default; forks override the resolver.
- If the flag depends on another flag, import and call that resolver rather than re-reading its env var (see `workflow-diagnostics-in-history-enabled.ts`). Check the cheap env var first.
- If the flag needs args (e.g. `{ cluster, domain }`), add `<flag-name>.types.ts` with a `<FlagName>ResolverParams` type (see `cron-list-enabled.types.ts`).

### 2. Register — `src/config/dynamic/dynamic.config.ts`

Three edits:

```ts
// import (alphabetical by file path)
import <flagName> from './resolvers/<flag-name>';

// type block
<FLAG_NAME>: ConfigAsyncResolverDefinition<undefined, boolean, 'request', true>;

// runtime block
<FLAG_NAME>: {
  resolver: <flagName>,
  evaluateOn: 'request',
  isPublic: true,
},
```

Replace `undefined` with the args type if the resolver takes args. `isPublic: true` is what exposes the key to the client via `/api/config`.

### 3. Zod schema — `src/config/dynamic/resolvers/schemas/resolver-schemas.ts`

```ts
<FLAG_NAME>: {
  args: z.undefined(), // or z.object({ cluster: z.string(), domain: z.string() })
  returnType: z.boolean(),
},
```

### 4. Test fixture — `src/utils/config/__fixtures__/resolved-config-values.ts`

```ts
<FLAG_NAME>: false,
```

The `getConfigValue` auto-mock reads from this, so server-side tests see the new key automatically.

### 5. Resolver test (only if the resolver has logic)

Skip for a plain env-var check. If the resolver combines conditions, calls another resolver, or takes args, add `src/config/dynamic/resolvers/__tests__/<flag-name>.node.ts`. Mirror `batch-actions-ui-enabled.node.ts`: `jest.mock` the imported resolvers, save/restore the env var in `beforeEach`/`afterEach`.

## Consuming the flag

Client:

```ts
const { data: isEnabled } = useSuspenseConfigValue('<FLAG_NAME>');
// or non-suspense: useConfigValue('<FLAG_NAME>', args?)
```

Server (route handlers): `await getConfigValue('<FLAG_NAME>')`.

Client tests mock the endpoint:

```ts
render(<Component />, {
  endpointsMocks: [
    {
      path: '/api/config',
      httpMethod: 'GET',
      mockOnce: false,
      httpResolver: async () => HttpResponse.json(true),
    },
  ],
});
```

## When the feature ships

Once the UI lands:

- Add a row to the **Feature flags** table in `README.md`
- Add a commented `# CADENCE_<FLAG_NAME>=true` under `### Feature flags` in `.env`

## Verify

```bash
npm run typecheck                                  # proves fixture + schema are complete
npm run test:unit:node <flag-name>.node.ts         # if you added a resolver test
npm run test:unit:node -- src/route-handlers/get-config src/utils/config src/config/dynamic
npm run lint
```

Optional live check: `npm run dev`, then `curl 'http://localhost:8088/api/config?configKey=<FLAG_NAME>'` → `false`; rerun with `CADENCE_<FLAG_NAME>=true npm run dev` → `true`.
