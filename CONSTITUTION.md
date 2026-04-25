# Portfolio Management Cockpit — Project Constitution

**Version:** 1.1.0
**Date:** 2026-03-18
**Author:** Daniel VM (GU Lead, Nova & Taurus Alliance)
**Status:** Active — governs all implementation decisions

> **Foundational text:** Robert C. Martin, *Clean Code: A Handbook of Agile Software
> Craftsmanship* (2008). Every principle below traces to a chapter or heuristic in
> that book, extended with the project's specific financial-data constraints.

---

## Purpose

This constitution defines the non-negotiable principles that govern every
implementation decision in the Portfolio Management Cockpit. It is the authoritative
source for resolving trade-offs between competing approaches. When in doubt, the
principle that protects financial data integrity or user trust wins.

---

## 1. Code Quality Principles

### 1.1 Names Must Reveal Intent (Clean Code Ch. 2)

Names are the first act of documentation. A name that requires a comment has failed.

- **Intention-revealing names:** `budgetVariancePercent` not `bvp`; `clientMonthlyRevenue`
  not `rev`
- **No encodings or Hungarian notation:** `userName` not `strUserName`;
  `isActive` not `bActive`
- **Pronounceable, searchable names:** avoid single-letter variables except `i`/`j` in
  tight loops; avoid `l`, `O`, `I` (they look like `1` and `0`)
- **One word per concept:** pick one verb and stick to it across the codebase — either
  `fetch`, `get`, or `retrieve` — never all three for the same operation
- **Class names are nouns:** `BudgetSummary`, `ClientScorecard`, `EtlProcessor` — never
  verbs or vague (`Manager`, `Processor`, `Data`, `Info`)
- **Function names are verbs:** `calculateBudgetVariance`, `formatCurrency`,
  `refreshMaterializedView` — never nouns
- **Constants over magic numbers:** every numeric literal used in business logic gets a
  named constant (see §1.6)

### 1.2 Functions Do One Thing (Clean Code Ch. 3)

A function that does two things is two functions waiting to be separated.

- Each function does **one thing** and does it well — if you cannot describe it without
  the word "and", split it
- Functions stay small — aim for ≤ 20 lines; if scrolling is required to read a
  function body, it needs extraction
- One level of abstraction per function: high-level orchestration functions call
  mid-level functions; mid-level functions call primitives — they never mix levels
- **No flag arguments:** a `boolean` parameter (`processRow(row, isDryRun)`) signals
  two functions — write `processRow(row)` and `dryRunRow(row)` separately
- **No output arguments:** functions either return a value or mutate their owner's
  state, never both; `appendToReport(report, section)` is a design smell
- **Command-Query Separation:** a function either answers a question (returns a value,
  no side effects) or performs an action (void, causes a side effect) — never both;
  `calculateAndSave()` is two functions

### 1.3 Comments Are a Last Resort (Clean Code Ch. 4)

A comment is an apology for code that failed to explain itself.

- **Prefer self-documenting code** over explanatory comments — rename the variable or
  extract the function before writing a comment
- **Acceptable comments:** legal headers, intent comments for non-obvious algorithmic
  choices, warnings of known consequences, `// TODO: <ticket-id> — <description>`
- **Forbidden comments:**
  - Commented-out code — delete it; git history is the undo button
  - Redundant comments that restate what the code obviously does
  - Noise: `// constructor`, `// end of loop`, section separator lines
  - TODOs without a ticket ID (`// TODO: fix this later` is not a TODO)
- JSDoc is required only on public API functions in `src/lib/` — never on internal
  helpers or React components

### 1.4 Don't Repeat Yourself — DRY (Clean Code Ch. 17, G5)

Duplication is the root of all software evil. Every piece of knowledge lives in
exactly one place.

- A financial calculation that appears in two places is a defect waiting for the two
  copies to diverge — extract it to `src/lib/calculations/`
- A Zod schema shared between the API route and the ETL pipeline belongs in
  `src/lib/schemas/` — never copy-pasted
- A data transformation used in two API routes belongs in a service function — not
  duplicated inline
- When you notice duplication while fixing a bug, removing it is part of the fix

### 1.5 Single Responsibility (Clean Code Ch. 10)

Each module has one reason to change.

- A component renders UI — it does not fetch, transform, or validate
- A hook fetches or transforms data — it does not render or directly modify the DOM
- A service function encapsulates one business operation — it does not reach into the
  database or call external APIs directly
- A query function returns typed data from the database — it does not contain
  business logic
- Data flows in one direction: API route → service → query → database;
  never skip layers

### 1.6 Named Constants, Never Magic Numbers (Clean Code Ch. 17, G25)

Every literal number in production code is a question with no answer. Name them.

```typescript
// src/lib/constants.ts
export const FILTER_DEBOUNCE_MS = 300;
export const CACHE_DASHBOARD_S   = 300;   // aligned with pg_cron refresh
export const CACHE_REFERENCE_S   = 3600;
export const MAX_ETL_ROWS        = 150_000;
export const GRID_COLUMNS        = 12;
export const MIN_TOUCH_TARGET_PX = 44;
export const NUMERIC_PRECISION   = 4;     // NUMERIC(18,4) in PostgreSQL
export const EXCHANGE_RATE_SCALE = 6;     // NUMERIC(12,6) for FX rates
```

Any pull request introducing a bare numeric literal in business logic or a query
is blocked.

### 1.7 Respect the Law of Demeter (Clean Code Ch. 6)

A function should know as little as possible about the internals of other objects.
Train wrecks (`user.account.profile.currency`) create tight coupling.

- A method may call methods on: itself, its own fields, its parameters, objects
  it directly created — nothing else
- Inject what you need, don't navigate to it — pass `currencyCode` not `user`
- API route handlers receive a typed request; they never reach into the session
  object to extract nested user preferences
- React components receive typed props — they never destructure deeply nested
  server state inline

### 1.8 Type Safety is Non-Negotiable

- TypeScript strict mode is always enabled: `"strict": true`,
  `"noUncheckedIndexedAccess": true`
- Every function parameter and return type is explicitly typed — no `any`,
  no `unknown` without an immediate narrowing guard
- Zod schemas validate every external boundary: form inputs, API request bodies,
  ETL row parsing, environment variables, Excel column mappings
- Database query results are typed via Drizzle's inferred types — no manual casting
- `// @ts-ignore` and `// @ts-expect-error` require a comment explaining why and a
  TODO referencing a ticket to remove it

### 1.9 Immutable Financial Data

- The cockpit is **read-only** — no UI writes to `fact_financial` or any dimension
  table directly
- ETL is the only path to data ingestion — all writes pass through the validated
  ETL pipeline with a Zod schema for every row
- Materialized views are refreshed by `pg_cron` — never triggered ad-hoc by
  user actions
- Financial calculation functions are **pure** — same inputs always produce the
  same output; no global state, no side effects, no I/O

### 1.10 Error Traceability (Clean Code Ch. 7)

- Every error message includes the failing entity ID:
  `"Client record not found: client_id=C-0042"`
- API errors return structured JSON: `{ error: string, code: string, entityId?: string }`
- No silent failures — every `catch` block either re-throws with added context,
  logs with entity ID, or returns a typed `Result<T, AppError>`
- **Never return `null`** from a function that could return a list — return `[]`;
  never return `null` from a function that could return an object — throw or
  return a typed error
- **Never pass `null` as an argument** — use optional parameters with defaults
- Database constraint violations surface as user-readable messages, not raw
  PostgreSQL error codes

### 1.11 Wrap Third-Party Boundaries (Clean Code Ch. 8)

External libraries must be wrapped behind project-owned interfaces. The application
depends on our abstraction, not on the library's API directly.

- ExcelJS is accessed only through `src/lib/excel/` — no direct `exceljs` imports
  outside this boundary
- `@react-pdf/renderer` is accessed only through `src/lib/pdf/` — no direct imports
  in page components
- `drizzle-orm` query builders are called only in `src/db/` — never in API routes
  or service functions
- If a library is ever replaced, only its boundary module changes

### 1.12 Dependency Discipline

- The rejected package list in CLAUDE.md is permanent — do not propose alternatives
  that reintroduce the same pattern
- No new dependencies without a written justification in the PR: what problem it
  solves, why the existing stack cannot solve it
- Dev dependencies never leak into production builds — verify with
  `@next/bundle-analyzer` before merging
- All dependencies pinned to minor range (`^major.minor.0`) — never `*` or `latest`

---

## 2. Testing Standards

### 2.1 The FIRST Principles (Clean Code Ch. 9)

Every test — unit, integration, and E2E — must satisfy all five properties:

| Property | Meaning | Violation Signal |
|----------|---------|-----------------|
| **Fast** | Unit tests finish in milliseconds | A unit test that takes > 100ms is doing I/O it shouldn't |
| **Independent** | No test depends on another test's state or order | Tests that must run in sequence are integration tests, not unit tests |
| **Repeatable** | Same result in CI, locally, in any environment | A test that passes locally but fails in CI has an environmental dependency |
| **Self-Validating** | Produces a binary pass/fail — no manual log inspection | If you have to read output to decide if it passed, it isn't a test |
| **Timely** | Written with or before the code under test — not weeks later | Tests written after the fact tend to test what the code does, not what it should do |

### 2.2 Test Pyramid

| Layer | Tool | Scope | Target Ratio |
|-------|------|-------|-------------|
| **Unit** | Vitest + happy-dom | Pure functions, Zod schemas, date utilities, financial calculations, currency formatting | ~60% |
| **Integration** | Vitest + real PostgreSQL | API routes, Drizzle queries, ETL pipeline, materialized view refresh, FX rate application | ~30% |
| **E2E** | Playwright | Critical user flows: login → dashboard → filter → currency toggle → export | ~10% |

### 2.3 What Must Have Tests

The following require tests — PRs without them are blocked:

- Every financial calculation function (budget variance, utilization %, NQC breakdown)
- Every currency formatting and conversion function in `src/lib/currency/`
- Every Zod schema used at an API boundary or ETL row boundary
- Every ETL transformation function (Excel row → database row, including FX conversion)
- Every API route (`/api/v1/**`) — at minimum happy path + validation error case
- Every Drizzle query function that returns aggregated or joined data

### 2.4 Clean Tests (Clean Code Ch. 9)

Readability is the most important quality of a test — more important than production code.

- Tests use `@testing-library/react` behavior assertions — never test
  implementation details (internal state, private methods, component structure)
- **No mocking the database** — integration tests run against a real PostgreSQL
  test database
- No mocking `date-fns` / `date-fns-tz` / `Intl` — use fixed timestamps and
  fixed exchange rates in test fixtures
- Test file co-location: `BudgetChart.test.tsx` lives next to `BudgetChart.tsx`
- One concept per test — one reason to fail; if a test name contains "and", split it
- **Build-Operate-Check pattern** for integration tests: arrange the fixture,
  execute the operation, assert the result — three clearly separated blocks
- Test names: `describe("formatCurrency") → it("formats JPY without decimal places")`

### 2.5 Coverage Thresholds

Enforced by Vitest coverage — builds fail below these:

| Area | Branch | Function | Line |
|------|--------|----------|------|
| `src/lib/` (calculations, validators, currency) | 90% | 95% | 90% |
| `src/app/api/` (API routes) | 80% | 90% | 85% |
| `src/db/` (queries) | 80% | 90% | 85% |
| `src/components/` (UI) | 60% | 70% | 65% |

### 2.6 E2E Test Scope (Phase 1)

Playwright tests cover exactly these flows — no more, no less until Phase 4:

1. Authentication via GCP IAP (dev: next-auth fallback)
2. Financial Overview: load → filter by GU → KPI cards render in USD
3. Budget vs. Actual: select period → chart renders with USD consolidated values
4. Currency context: switch view from consolidated (USD) to local currency →
   amounts re-render in local currency with USD tooltip
5. Excel upload → ETL processing → data appears in dashboard with correct FX amounts
6. Export: PDF and Excel download with correct currency column headers

---

## 3. User Experience Consistency

### 3.1 MUI 7 is the Only UI System

- All UI is built with MUI 7 components — no custom CSS, no Tailwind, no inline
  style objects except for one-off `sx` values
- The `sx` prop is the only accepted styling mechanism beyond the MUI theme —
  no `styled()` wrappers except in `src/theme/`
- The MUI theme is the single source of truth for colors, typography, spacing,
  and breakpoints — hardcoded hex values are forbidden outside `src/theme/`
- Component variants are defined in the theme — not inline per usage

### 3.2 Currency Display Standards (v1: 11 Currencies)

The cockpit supports 11 currencies for v1. All consolidated views use USD.
Local currency views display the original currency with a USD equivalent tooltip.

#### 3.2.1 Supported Currencies

| Country | Code | Symbol | Decimal Places | Locale |
|---------|------|--------|----------------|--------|
| United States | `USD` | `$` | 2 | `en-US` |
| Canada | `CAD` | `CA$` | 2 | `en-CA` |
| Mexico | `MXN` | `$` | 2 | `es-MX` |
| Colombia | `COP` | `$` | 0 | `es-CO` |
| Brazil | `BRL` | `R$` | 2 | `pt-BR` |
| United Kingdom | `GBP` | `£` | 2 | `en-GB` |
| Portugal | `EUR` | `€` | 2 | `pt-PT` |
| China | `CNY` | `¥` | 2 | `zh-CN` |
| Japan | `JPY` | `¥` | 0 | `ja-JP` |
| Australia | `AUD` | `A$` | 2 | `en-AU` |
| Philippines | `PHP` | `₱` | 2 | `fil-PH` |

> COP and JPY have 0 decimal places — their amounts are stored as
> `NUMERIC(18,0)` equivalent but kept as `NUMERIC(18,4)` in the schema;
> the formatting layer truncates display to 0 decimals.

#### 3.2.2 Database Storage

`fact_financial` stores four currency columns per row:

```sql
amount_local       NUMERIC(18,4)  NOT NULL,   -- original amount in source currency
currency_code      CHAR(3)        NOT NULL,   -- ISO 4217: 'USD', 'BRL', 'JPY', …
amount_usd         NUMERIC(18,4)  NOT NULL,   -- converted to USD at ETL time
exchange_rate_usd  NUMERIC(12,6)  NOT NULL,   -- rate used: 1 <currency_code> = N USD
rate_date          DATE           NOT NULL    -- date the exchange rate was applied
```

Exchange rates are sourced at ETL time — not recomputed on query. Historical
comparisons use the rate that was applied when the row was ingested.

#### 3.2.3 Formatting Function

All currency formatting goes through a single function in `src/lib/currency/`:

```typescript
// src/lib/currency/format.ts

export type CurrencyCode =
  | 'USD' | 'CAD' | 'MXN' | 'COP' | 'BRL'
  | 'GBP' | 'EUR' | 'CNY' | 'JPY' | 'AUD' | 'PHP';

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style:                 'currency',
    currency,
    minimumFractionDigits: CURRENCY_DECIMALS[currency],
    maximumFractionDigits: CURRENCY_DECIMALS[currency],
  }).format(amount);
}
```

- `Intl.NumberFormat` is built into V8/Node.js — no library required
- `CURRENCY_LOCALE` and `CURRENCY_DECIMALS` are named constant maps in the same file
- No other code may call `Intl.NumberFormat` for financial amounts — only
  `formatCurrency` and `formatCurrencyCompact` (for KPI cards)
- Direct string interpolation of amounts (`$${amount.toFixed(2)}`) is forbidden

#### 3.2.4 Display Rules

| View Context | Display Currency | Tooltip |
|-------------|-----------------|---------|
| Global / Alliance consolidated dashboard | USD always | — |
| GU-level dashboard | USD always | — |
| Client scorecard | Local currency of client's country | USD equivalent |
| Project detail | Local currency of project's country | USD equivalent |
| Budget vs. Actual comparison | Both columns: local + USD | — |
| Excel export | Both columns present; local + USD | — |
| PDF report | USD only (consolidated report) | — |

#### 3.2.5 Currency Context in the UI

- A `CurrencyContext` Zustand slice stores `{ displayCurrency: CurrencyCode, showUsdEquivalent: boolean }`
- The `FilterBar` component includes a currency selector only on views that support
  local currency toggle (client scorecard, project detail)
- Consolidated views (GU, Alliance) render no currency selector — they are
  always USD
- A `<CurrencyBadge currency={code} />` component displays the ISO code and
  symbol next to any amount column header

#### 3.2.6 Currency in Tests

```typescript
// Test fixtures must use these constants — never hardcoded amounts
export const FIXTURE_USD_AMOUNT  = 100_000.00;
export const FIXTURE_BRL_AMOUNT  = 500_000.00;
export const FIXTURE_BRL_TO_USD  = 0.200000;   // 1 BRL = 0.20 USD
export const FIXTURE_JPY_AMOUNT  = 15_000_000; // JPY: integer only
export const FIXTURE_JPY_TO_USD  = 0.006700;   // 1 JPY = 0.0067 USD
```

Every `formatCurrency` test must cover: positive, zero, large numbers
(≥ 1M), and the zero-decimal currencies (COP, JPY).

### 3.3 Date Display Standards

- All dates display as `YYYY-MM-DD HH:mm:ss+HH:mm` — no relative dates
  ("3 days ago"), no ambiguous `MM/DD/YY` formats
- `date-fns` and `date-fns-tz` are the only date libraries — no `new Date()` string
  manipulation outside `src/lib/dates/`
- ETL stores timestamps with timezone offset; the UI preserves and displays the offset

### 3.4 Dashboard Layout Rules

- All dashboards follow the 12-column MUI Grid system
- KPI cards always appear in a consistent row above charts and tables
- Filters (including currency selector) are always in the `FilterBar` component —
  never inline within a chart or table
- The left navigation is visible on `lg` breakpoint and above; collapses to a
  drawer on mobile
- Page titles: `{Dashboard Name} — Portfolio Cockpit`

### 3.5 Data States

All four data states must be handled explicitly — no component renders in an
undefined state:

| State | Component | Rule |
|-------|-----------|------|
| **Loading** | MUI `Skeleton` matching content shape | No generic spinners for data-heavy components |
| **Empty** | Explicit message + reason | "No data available for this period and filter selection" |
| **Error** | Error message + entity ID + retry action | Never swallow errors silently |
| **Populated** | Formatted content per §3.2 | Data is always formatted — never raw numbers |

### 3.6 Interaction Patterns

- All data tables use `@mui/x-data-grid` with server-side pagination — no
  client-side pagination for datasets > 100 rows
- Filter changes (including currency context changes) trigger debounced API
  calls (`FILTER_DEBOUNCE_MS = 300`) — never immediate on every keystroke
- Export actions show a loading indicator and disable the button until the
  file is ready
- Destructive actions require a MUI `Dialog` confirmation — never `window.confirm()`
- All clickable elements: minimum `MIN_TOUCH_TARGET_PX = 44` × 44px (WCAG 2.1 AA)

### 3.7 Accessibility Baseline

- All MUI components used with default accessibility attributes intact —
  do not suppress `aria-*` props
- Every chart includes a data table alternative accessible to screen readers
- Color is never the sole indicator of status — always pair with icon or text label
- Currency amounts must include a visually hidden ISO code for screen readers:
  `<span aria-label="one hundred thousand US dollars">$100,000.00</span>`
- Focus management is correct on all Modal/Dialog/Drawer open and close events

---

## 4. Performance Requirements

### 4.1 Core Web Vitals Targets (Production)

Measured by Lighthouse CI on every PR targeting `main`:

| Metric | Target | Hard Block |
|--------|--------|------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.0s | > 3.5s |
| **INP** (Interaction to Next Paint) | ≤ 150ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.05 | > 0.1 |
| **TTFB** (Time to First Byte) | ≤ 400ms | > 800ms |
| **FCP** (First Contentful Paint) | ≤ 1.2s | > 2.0s |

### 4.2 API Response Time Targets

| Endpoint Category | P50 | P95 |
|-------------------|-----|-----|
| Dashboard KPI aggregations (USD consolidated) | ≤ 200ms | ≤ 500ms |
| Dashboard KPI aggregations (local currency) | ≤ 200ms | ≤ 500ms |
| Paginated data table queries | ≤ 150ms | ≤ 400ms |
| Filter-driven re-queries | ≤ 200ms | ≤ 500ms |
| Excel export (with dual-currency columns) | ≤ 3s | ≤ 8s |
| PDF report generation (USD only) | ≤ 5s | ≤ 12s |
| ETL upload with FX conversion | ≤ 30s | ≤ 60s |

Currency conversion at query time is forbidden — amounts are pre-converted at
ETL time and stored as `amount_usd`. This is what makes the response targets
achievable.

### 4.3 Bundle Size Constraints

| Bundle | Max gzipped |
|--------|-------------|
| First Load JS (shared) | 120 KB |
| Per-page JS (average) | 60 KB |
| Per-page JS (max, any page) | 120 KB |
| CSS (total) | 30 KB |

`Intl.NumberFormat` is a V8 built-in — it adds 0 bytes to the bundle. No
currency formatting library is ever justified given this.

MUI tree-shaking must be verified: named imports from `@mui/material` are acceptable
at the component level; barrel imports (`import { Button, TextField, Select }`) are
blocked in hot path code.

### 4.4 Database Performance Rules

- Every query against `fact_financial` or joined dimension tables must go through
  a materialized view — not the raw table
- New materialized views require an `EXPLAIN ANALYZE` result in the PR showing
  sub-500ms on the 150K-row test dataset
- All foreign keys on fact tables have an index — Drizzle schema includes
  `index()` declarations
- `currency_code` is indexed on `fact_financial` — currency-filtered queries
  must use this index
- `pg_cron` refresh schedules are documented in `ADR-001` when added or changed
- Connection pooling via PgBouncer — never open raw connections per request

### 4.5 Caching Strategy

Every server-side `fetch` declares its strategy explicitly:

| Data Type | Strategy | Value |
|-----------|----------|-------|
| Dashboard KPI aggregations | `revalidate` | `CACHE_DASHBOARD_S = 300` |
| Currency reference data (supported codes, symbols) | `revalidate` | `CACHE_REFERENCE_S = 3600` |
| GU / client name lists | `revalidate` | `CACHE_REFERENCE_S = 3600` |
| User filter state | Zustand client store | Never cached server-side |
| Exchange rates (display only, not for conversion) | `revalidate` | `CACHE_REFERENCE_S = 3600` |
| Financial fact data | `cache: 'no-store'` | Stale financial data is a correctness bug |

---

## 5. The Boy Scout Rule (Clean Code Ch. 1)

> *Always leave the code cleaner than you found it.*

This is not a request for big-bang refactoring sessions. It is a continuous
obligation: every PR leaves the codebase incrementally better than it found it.

Concrete applications:
- Fix a misleading variable name when you touch the function
- Extract a magic number to a named constant when you use that number
- Remove a commented-out code block when you see it
- Add a missing test for an untested edge case you discover while fixing a bug

If a cleanup requires more than 15 minutes, it becomes a tracked ticket — not a
scope creep addition to an unrelated PR.

---

## 6. Resolution Protocol

When two principles conflict, apply this priority order:

1. **Financial data integrity** — correctness always beats performance
2. **Type safety** — a type error is a bug, never suppress it
3. **User experience consistency** — one pattern everywhere beats the "best" pattern
   per component
4. **Performance** — meet the targets, not at the cost of correctness or readability
5. **Code quality** — clean code is valuable but never blocks a correct, consistent,
   performant feature

If a decision cannot be resolved by these principles, it becomes an ADR. ADRs are
the escape hatch — use them explicitly, not silently.
