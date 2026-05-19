# Create schedule — implementation tasks (Ralph / ralphmd)

Placeholder ids (`SLICE-n`) label dependency order only. Do not publish to a remote tracker unless the team explicitly asks.

**Ralph / ralphmd:** Each top-level `- [ ] **…**` block is one executable task. Sub-bullets must be exactly `Read`, `Do`, `Output`, `Done when` (per-task checklist lives under **Done when**). Run tasks in slice order; optional slices say when to skip.

**References:** [prd-create-schedule.md](../prd-create-schedule.md), [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md).

---

- [x] **SLICE-1 — Schedule write client foundation (IDL + gRPC)**
  - Read: [prd-create-schedule.md](../prd-create-schedule.md), [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md), repo IDL / codegen docs (e.g. `package.json` scripts for protobuf), existing gRPC cluster client modules under `src/`
  - Do: Regenerate protobuf TypeScript when the Schedule API requires it (repo standard command only; never hand-edit `src/__generated__/`). Expose a typed CreateSchedule (or equivalent Schedule write) path on the shared gRPC cluster client. Confirm RPC name and request shape against IDL before locking downstream handler contracts. Infrastructure-only: no HTTP route or UI in this task.
  - Output: Updated generated stubs if IDL changed; cluster client API surface for Schedule create/write with typings aligned to generated code; minimal compile-time or smoke assertion if the team uses one to lock client ↔ IDL match
  - Done when: IDL regenerated via standard command when needed; no manual edits under generated output; cluster gRPC client exposes Schedule create/write consistent with stubs; `npm run typecheck` passes; PR notes scope, stack position (PR00), and verification commands per project template

- [x] **SLICE-2 — Main-form HTTP contract: shared Zod, transform, POST handler, node tests**
  - Read: [prd-create-schedule.md](../prd-create-schedule.md), [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md), `src/route-handlers/create-schedule/`, existing route-handler patterns and `GRPCError` / logger usage elsewhere in `src/route-handlers/`
  - Do: Implement POST create-schedule end-to-end on the server: Zod validation aligned with the Figma main-column contract; transform JSON → gRPC input (server-generated `scheduleId` when omitted; `workflowIdPrefix` behavior; policy defaults and conditional validation e.g. catch-up window vs skip, overlap/buffer/concurrency per PRD); call cluster create RPC from SLICE-1; return JSON with GRPCError HTTP status mapping; structured logging on failure. Node tests: UUID defaulting, explicit `scheduleId`, policy and input mapping, error statuses, default payload vs policy constants — use **IDL string literals** only in fixtures.
  - Output: `src/route-handlers/create-schedule/` (schema, transform, handler, tests), any small shared helpers colocated per project conventions
  - Done when: Next API route invokes the handler; invalid body → 400 with field-oriented validation detail where applicable; omitted `scheduleId` → server UUID before gRPC; optional valid caller `scheduleId` honored; `taskStartToCloseTimeoutSeconds` and `executionStartToCloseTimeoutSeconds` required on this path with **no** transform default for task STC; omitted/partial policies merge to documented defaults (contract documented in tests); cluster errors map to correct HTTP status and safe messages; handler logs failures with structured context; node tests cover happy path, validation edges, conflict-style outcomes without hand-maintained enum spellings that bypass IDL

- [x] **SLICE-3 — Optional refactor: shared UI paths only (no schedule behavior)**
  - Read: [prd-create-schedule.md](../prd-create-schedule.md), [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md), import graph around create-schedule and shared UI modules touched by PR02
  - Do: **Skip entirely** if duplication or imports do not block SLICE-4. If needed: extract/move/re-export shared UI or modules **without** changing create-schedule POST, Zod, transform semantics, or tests’ observable behavior beyond import paths.
  - Output: Refactored files only; PR labeled refactor-only with explicit “no feature” scope
  - Done when: No intentional behavior change in create-schedule POST, Zod, or transform; tests updated only for path changes with same coverage intent; task marked complete with “skipped — not needed” in PR or commit message if you skipped

- [x] **SLICE-4 — Client mutation: create schedule POST, invalidation, pending state**
  - Read: [prd-create-schedule.md](../prd-create-schedule.md), [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md), existing TanStack Query mutations and schedules list/infinite-query keys in `src/`
  - Do: After SLICE-2 (and SLICE-3 if it shipped): add a mutation that POSTs create-schedule JSON to the domain/cluster schedules API; surface typed errors; expose **pending** for submit guards; on success invalidate the **same infinite-query key family** as the schedules table. Colocate small tests if the hook has non-trivial branching.
  - Output: Mutation module/hook and tests per project layout
  - Done when: Successful create invalidates schedules queries compatibly; mutation exposes in-flight state for disabling submit; 400/409-style errors consumable by forms without unsafe internals; tests cover invalidation and pending if not trivially covered elsewhere

- [x] **SLICE-5 — Create-schedule modal shell + placeholder + domain schedules entry**
  - Read: [prd-create-schedule.md](../prd-create-schedule.md), [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md), expanded shell Figma in the plan, existing modal/drawer patterns in `src/`, fork-friendly testing rules in `CLAUDE.md`
  - Do: Ship the **UI shell** only: dedicated create-schedule modal (or drawer) with **placeholder** body (static copy or empty region — **no** cron, workflow fields, policies, `react-hook-form`, or POST to create-schedule). Wire **open** from schedules empty state + header per PRD/upstream (consolidated header — rebase/merge per PRD to avoid duplicate toolbars). **Close** on backdrop, Escape, and close control. Footer may show a **disabled** primary action or omit primary until SLICE-6 — **no** mutation calls and **no** successful create from this PR.
  - Output: Modal component(s), domain-schedules entry wiring, optional colocated browser test(s) limited to open/close + placeholder visibility (DOM + baseui only)
  - Done when: Create opens the modal from the agreed entry points; placeholder is visible; modal closes as specified; UI does not invoke the SLICE-4 mutation or submit create-schedule JSON; `npm run typecheck` passes; PR documents verification commands and stack position (**PR04**)

- [x] **SLICE-6 — Figma main form + mutation wiring + browser tests**
  - Read: [prd-create-schedule.md](../prd-create-schedule.md), [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md), SLICE-4 mutation API, shared cron and Start-workflow input patterns in `src/`, fork-friendly testing rules in `CLAUDE.md`
  - Do: Replace the PR04 placeholder with the **full main column**: wire to SLICE-4 mutation; reuse shared cron and same workflow-input processing as Start workflow; render main-column policies without accordion on first ship. Validation UX (400 → field/form errors); in-modal cluster errors with values preserved; loading/disabled submit while pending; close without unsaved prompt where applicable; success snackbar, modal close, list refresh. Browser tests: DOM + design-system primitives only (fork-friendly): happy submit, validation messaging, in-modal server errors, disabled submit while pending. No post-create deep link until a detail route exists.
  - Output: Form views, wiring, browser tests under appropriate `__tests__/`
  - Done when: Flow matches agreed Figma main column at a practical level; wire values use IDL literals in submitted JSON; cron required via shared cron path; submit non-reentrant while pending; browser tests cover operator-visible behaviors without asserting nested custom `src/` components; PR documents verification commands and stack position (**PR05**)

- [ ] **SLICE-7 — Main-column remainder vs Start workflow (post–first ship parity)**
  - Read: [prd-create-schedule.md](../prd-create-schedule.md), [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md), Start workflow main column implementation, acceptance table in PRD
  - Do: After SLICE-6: list gaps between create-schedule main form and Start workflow / acceptance table; for each gap cluster extend HTTP schema, transform, and UI **together** in one reviewable chunk; ship tests with each behavioral change.
  - Output: Updated schema, transform, handler, UI, and tests per gap cluster; PRD/plan updates for explicit deferrals
  - Done when: Documented gap list addressed or explicitly deferred with PRD/plan update; JSON field names stable or versioned with migration notes if renamed; browser and/or node tests cover new fields and validation; HITL only if product/design sign-off required — else treat as AFK once gaps are enumerated; PR documents stack position (**PR06**)

- [ ] **SLICE-8 — Advanced accordion: extended HTTP, transform, and UI**
  - Read: [prd-create-schedule.md](../prd-create-schedule.md), [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md), `ScheduleOverlapPolicy` and related generated types under `src/__generated__/`, design system accordion patterns
  - Do: Add advanced section (accordion; default collapsed unless design says otherwise): schedule memo/search attributes, start-workflow retry/memo/search, spec start/end/jitter, remaining SchedulePolicies/spec fields not on main path. Extend Zod, transform, UI together; IDL literals on wire; schema tests + browser coverage for accordion a11y.
  - Output: Extended schema, transform, handler, UI, tests
  - Done when: Advanced fields round-trip to gRPC only when present; omission leaves prior behavior; accordion UX matches design system; keyboard/focus per project testing guidance; schema/handler tests cover new conditionals and advanced payloads; main-column policy controls do not move behind accordion unless PRD updated (**PR07**)

- [ ] **SLICE-9 — Advanced overflow split (conditional)**
  - Read: [plan_create_schedule_stacked_prs.md](../plan_create_schedule_stacked_prs.md), scope of SLICE-8 PR vs reviewable size
  - Do: **Only if** SLICE-8 would exceed reviewable size or mixes risky integrations: split remainder of **PR07** into this follow-up (Zod + transform + UI + tests still travel together per field cluster).
  - Output: Second PR/slice worth of advanced work
  - Done when: Scope is explicitly remainder of PR07 not merged in SLICE-8; no partial wire formats — any JSON field accepted is validated and transformed in the same slice that introduces UI for it; mark complete with “skipped — merged in SLICE-8” if not needed; PR documents stack position (**PR07b**)

---

## Dependency summary (human)

```text
SLICE-1 → SLICE-2 → SLICE-4 → SLICE-5 → SLICE-6 → SLICE-7 → SLICE-8 → [SLICE-9 optional]
            ↘ SLICE-3 (optional) ↗
```

SLICE-4 follows SLICE-3 when SLICE-3 shipped; otherwise SLICE-4 follows SLICE-2 directly.

### Type hints (AFK vs HITL)

- **SLICE-1, 2, 3, 4, 5, 6, 8, 9:** AFK unless noted in PRD.
- **SLICE-5:** Coordinate upstream header merge as integration risk.
- **SLICE-6:** Primary browser-test slice for create flow.
- **SLICE-7:** HITL only if gap list needs product/design sign-off.

### User story index (representative — not ralphmd fields)

- SLICE-1: 28, 35, 42, 55–56 + plan “confirm RPC”
- SLICE-2: 3–15, 17–22, 27–28, 30–33, 36–38, 44–47, 50, 52–54, 58–60, 62–63, 65–66
- SLICE-3: 39, 42, 57
- SLICE-4: 22, 25, 27, 59
- SLICE-5: 1–2, 16 (open modal), 40, 43, 48 (+ header coordination)
- SLICE-6: 16–26, 40, 43, 48, 61–65 (+ 37 in browser tests)
- SLICE-7: 41, 5, 43, 62–63, design parity
- SLICE-8: 29, 51, 64 + advanced acceptance rows
- SLICE-9: subset of 29, 51, 64 if split

