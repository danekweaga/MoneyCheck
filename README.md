# MoneyCheck

## 1) Overview
MoneyCheck is a decision support app for students and early-career adults who are trying to answer one practical question: **"Can I afford this purchase without quietly damaging my future?"**

It is built for people who already track rough income/expenses but still make spending decisions in the moment, without a clear way to evaluate tradeoffs.

The app solves this by turning each spending decision into a structured check with four concrete outputs:
- budget impact percentage
- future value lost
- risk level
- regret score

That gives users a repeatable framework instead of relying on gut feel.

## 2) Why This Exists
Most budgeting apps are good at categorizing past transactions, not evaluating a **future** purchase before it happens.

Existing tools usually fail in one of two ways:
- they are too broad (full personal finance dashboards with high setup overhead)
- or too shallow (simple affordability calculators that ignore opportunity cost)

MoneyCheck exists to fill that gap: fast pre-spend analysis with enough context to be useful, but without requiring full financial planning software.

## 3) Core Idea
The core idea is simple: treat every non-trivial spend as a small architecture decision.

Instead of asking "Can I pay for it?", MoneyCheck asks:
- how much monthly pressure does this create?
- what is the long-term cost if this money could have grown?
- how risky is this relative to the user’s own baseline?

The app is intentionally opinionated: users enter a scenario, get a clear verdict, and can compare outcomes over time.

## 4) Key Features
- **Guided onboarding profile**  
  Captures income, expenses, savings goal, and risk tolerance so every check is personalized.

- **Money check flow**  
  Users input amount, rates, and payoff horizon; the app computes budget impact, future value lost, risk level, and regret score.

- **Result screen designed for decision clarity**  
  Key metrics are surfaced first, recommendation is prominent, and risk is color-coded for quick interpretation.

- **History and export**  
  All checks are stored and viewable chronologically, with Excel export for offline review or coaching conversations.

- **AI coach with usage guardrails**  
  Chat assistant uses profile + recent checks for context, with daily credit limits to prevent abuse and control cost.

- **Adjustable spendable buffer**  
  Users can add temporary external funds (gift/refund/side cash) without rewriting baseline monthly income.

- **Responsive dual-view UI**  
  Mobile and desktop views are purpose-built rather than only CSS-scaled, so key actions stay obvious on both.

## 5) Architecture & Tech Stack
- **Next.js App Router (server-first rendering)**  
  Chosen for predictable routing, server components by default, and route-level loading states. This keeps auth/data decisions on the server and reduces client-side fetch complexity.

- **Supabase (Auth + Postgres + RLS)**  
  Chosen to keep identity, relational data, and authorization rules in one system. Row-level security keeps data ownership enforced at the database layer, not only in app code.

- **Server Actions + Route Handlers**  
  Mutations happen server-side (`lib/actions/*`) and API responsibilities stay narrow (`app/api/*`). This reduces duplicated business logic and centralizes failure handling.

- **Zod + React Hook Form**  
  Chosen for strict input validation and coherent error messaging from UI to server.

- **OpenAI API for assistant layer**  
  AI is used as an advisory interface, not as the calculation engine. Deterministic financial metrics stay in local domain logic.

## 6) How It Works
1. **Authentication and route gating**  
   User signs in. Middleware and page-level checks enforce access rules (protected pages require auth; login/signup blocked for authenticated users).

2. **Profile baseline setup**  
   User completes onboarding profile. If incomplete, app routes to onboarding before dashboard access.

3. **Create a check**  
   User submits scenario input. Server action validates schema, loads profile context, and runs deterministic calculations.

4. **Persist + render result**  
   Check is written to `money_checks`, then user is redirected to result view where metrics and recommendation are presented.

5. **Review and iterate**  
   Checks appear in dashboard/history; user can export records or ask AI for contextual coaching.

### Data Flow (high level)
- `UI form` -> `Zod validation` -> `Server Action` -> `Supabase query/insert` -> `Calculation engine` -> `stored record` -> `result/history views`
- `AI chat` -> `Route Handler` -> `auth + credits check` -> `profile/recent checks context` -> `OpenAI` -> `response + usage event`

## 7) Key Technical Decisions
- **Separated financial calculations from AI**  
  `lib/calculations/money-check.ts` is deterministic and testable. AI is only used for explanation/coaching so core outputs do not drift.

- **Defense-first error handling**  
  Supabase errors are handled explicitly, malformed JSON is guarded, and server actions return user-facing errors rather than throwing users into runtime crashes.

- **Auth decisions centralized in middleware, verified at page/API boundaries**  
  Middleware provides fast route-level control; page/API checks provide safety against edge cases and direct route hits.

- **Profile completeness as explicit gating signal**  
  Core routes and sensitive APIs enforce onboarding completion to avoid invalid calculations and confusing empty states.

- **Temporary cash modeled as `extra_spendable`**  
  Keeps recurring income clean while still supporting realistic one-off cash events.

## 8) Challenges & Solutions
- **Challenge: redirect loops during profile evolution**  
  As profile schema changed, completion checks risked divergence.  
  **Solution:** aligned middleware/page completion logic and added migration-safe fallback behavior.

- **Challenge: API stability under malformed requests**  
  `request.json()` can throw before validation.  
  **Solution:** wrapped parsing and route logic in layered `try/catch` with explicit 400/401/403/500 responses.

- **Challenge: stale or missing dependent data**  
  Credits table or profile fields may be unavailable during migration phases.  
  **Solution:** added graceful fallback behavior and non-blocking defaults where safe.

- **Challenge: balancing richer UX with predictable performance**  
  Chat widget and interactive forms can inflate client work.  
  **Solution:** lazy-loaded non-critical client components and kept data-heavy paths server-rendered.

## 9) Limitations
- Financial model is intentionally simple and not a full planning engine (no debt snowball simulation, tax modeling, or portfolio allocation).
- AI advice is constrained and non-authoritative; it is guidance, not licensed financial advice.
- No formal multi-user collaboration features (shared household budgets, partner accounts).
- Some lint warnings remain in legacy form code paths and should be cleaned in a follow-up pass.

## 10) Future Improvements
- Add scenario comparison mode (side-by-side check variants).
- Add tests around calculation correctness and routing guard invariants.
- Introduce richer historical analytics (trend lines, category risk drift).
- Add offline-first draft mode for check creation on unstable networks.
- Add more nuanced risk scoring inputs (cash runway, fixed-cost ratio).

---

## Local Development
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

If using Supabase locally, ensure migrations are applied before testing onboarding/settings/export flows.
