---
name: ship-pr
description: Open a pull request for the current changes and babysit it to green — push the branch, create the PR, then run a 1-minute watch loop that answers and resolves review comments (Copilot), re-runs infra-cancelled CI, reports the Cloudflare Pages preview URL, and closes the loop when the PR is clean. Use when the user says "abrir o PR", "open the PR", "ship this", "sobe o PR e acompanha", or asks to open a PR and watch/handle its review + preview + checks.
---

# ship-pr — open a PR and babysit it to green

This skill takes work that is ready on the current branch, opens a PR for it, and
then **watches the PR on a recurring loop** until it is clean: review threads
answered and resolved, CI green, and the Cloudflare Pages preview reported.

Report progress to the user **concisely in their language** (this team works in
pt-BR). One short status line per loop tick when nothing changed; a fuller report
only when something actually happened.

---

## Repo facts (craft-code-club/blog-c3)

- **Repo**: `craft-code-club/blog-c3`, default branch `main`.
- **Static export** Next.js (`output: "export"`). No runtime server — everything
  is built at deploy time.
- **Push over HTTPS, not SSH.** The `origin` remote is SSH
  (`git@github.com:…`) and the SSH key does **not** work in this environment.
  Run `gh auth setup-git` once, then push with the explicit HTTPS URL:
  `git push https://github.com/craft-code-club/blog-c3.git HEAD:<branch>`.
- **Preview**: Cloudflare Pages (`cloudflare-pages-deploy.yml`). When the deploy
  job finishes it posts a **sticky issue comment** containing `Preview Url` and a
  `https://<hash>.blog-c3.pages.dev` link.
- **Review bot**: GitHub **Copilot** (`copilot-pull-request-reviewer[bot]`) leaves
  inline review comments a minute or two after the PR opens.
- **Checks**: `Build Pages` + `Deploy to Cloudflare Pages` (from the Cloudflare
  workflow) and `CodeQL` / `CodeQL Analyze (javascript)` (from `codeql-analysis.yml`,
  which runs a single `javascript` language matrix). This repo has **no**
  default-setup CodeQL, so there is no `Analyze (javascript-typescript)` check.

---

## Phase 1 — Open the PR

1. **Know the diff.** `git status` and `git log main..HEAD`. If the work is not
   committed yet, or you are on `main`, create a feature branch first
   (`git checkout -b <type>/<slug>`) — never commit straight to `main`.
2. **Validate before committing** (skip only for docs/markdown-only changes):
   - `npx tsc --noEmit`
   - `npm run build` (this is the real gate — it runs the static export and
     surfaces `output: export` problems)
   - Do **not** rely on `next lint` / `eslint` — it throws before it lints:
     `eslint-plugin-react` (pulled in via `eslint-config-next`) is incompatible
     with ESLint 10 (`contextOrFilename.getFilename is not a function`). The repo
     uses flat config (`eslint.config.mjs`); there is no `.eslintrc`. `tsc` +
     `build` are the gates.
3. **Commit** with a clear conventional-commit message. End the commit body with:
   ```
   Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
   Claude-Session: <the current session URL>
   ```
4. **Push over HTTPS** (see Repo facts): `gh auth setup-git` then
   `git push https://github.com/craft-code-club/blog-c3.git HEAD:<branch>`.
5. **Create the PR** with `gh pr create --repo craft-code-club/blog-c3 --base main`.
   Write a body that states the problem, the approach, key decisions, and how it
   was validated. End the body with:
   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```
6. Tell the user the PR number and URL, then start Phase 2.

If a PR for this branch already exists, skip to Phase 2 (find it with
`gh pr view --repo craft-code-club/blog-c3 <branch>`).

---

## Phase 2 — Start the watch loop

Set up a **1-minute recurring cron** with `CronCreate`:
`cron: "*/1 * * * *"`, `recurring: true`, and a **self-contained prompt** that
embeds the Phase 3 procedure (so each fire re-runs the watch). Keep the returned
**job ID** — you need it to stop the loop later. Then run one iteration
immediately (don't wait for the first fire).

The cron prompt should say, in effect: *"Watch PR #<N> of craft-code-club/blog-c3
following the ship-pr skill's watch procedure: handle new review comments, re-run
infra-cancelled checks, report the preview once, warn on real failures, and when
clean stop the loop with CronDelete <job-id>. Report only what changed since last
tick."*

---

## Phase 3 — Each watch iteration

Run these each tick and report only the delta.

### A. Review comments (Copilot)

- The reliable "is anything unhandled?" signal is the count of **unresolved review
  threads**, via GraphQL — **not** a REST `in_reply_to_id == null` filter (root
  comments always have `in_reply_to_id == null`, even after you reply):
  ```bash
  gh api graphql -f query='{repository(owner:"craft-code-club",name:"blog-c3"){pullRequest(number:PR){reviewThreads(first:50){nodes{isResolved}}}}}' \
    --jq '[.data.repository.pullRequest.reviewThreads.nodes[]|select(.isResolved==false)]|length'
  ```
- If there are unresolved threads, **evaluate each on its merits** — do not
  rubber-stamp. Fix the ones that are right; push the fix (validate again with
  `tsc`/`build` first). To **reply then resolve** the *same* thread you need two
  ids, both from one `reviewThreads` query: the thread node `id` (for the resolve
  mutation) and its **root comment's `databaseId`** (the `<id>` the REST replies
  endpoint expects). Fetch them together — that mapping is the whole point of
  selecting `comments` inside each thread node:
  ```bash
  gh api graphql -f query='{repository(owner:"craft-code-club",name:"blog-c3"){pullRequest(number:PR){reviewThreads(first:50){nodes{id isResolved comments(first:1){nodes{databaseId body}}}}}}' \
    --jq '.data.repository.pullRequest.reviewThreads.nodes[]|select(.isResolved==false)|{threadId:.id, commentId:.comments.nodes[0].databaseId}'
  ```
  - **Reply** to the root comment's `databaseId`:
    `gh api --method POST repos/craft-code-club/blog-c3/pulls/PR/comments/<databaseId>/replies -f body="…"`.
    - If you fixed it: say so and reference the fix commit SHA.
    - If you disagree: explain why (a declined comment is still resolved with a
      rationale, not silently ignored).
  - **Resolve** the thread by its node `id`, passed as a **variable** (string
    interpolation into the query breaks with "malformed"):
    ```bash
    gh api graphql -f threadId="$TID" -f query='mutation($threadId: ID!){resolveReviewThread(input:{threadId:$threadId}){thread{id isResolved}}}'
    ```

### B. CI checks

- `gh pr checks PR --repo craft-code-club/blog-c3`.
- **Warn the user on any real failure.** But first distinguish infra from code:
  a job that shows `fail` at ~`15m` with an empty step list is almost always a
  **queue timeout** (no runner), reported as `conclusion: cancelled`, not your
  code. Confirm with:
  `gh api repos/craft-code-club/blog-c3/actions/jobs/<jobId> --jq '{conclusion, steps: (.steps|length)}'`
  (`cancelled` + `0` steps = infra).
  - Remedy: `gh run rerun <runId> --repo craft-code-club/blog-c3`. A check that
    reports *"cannot be retried"* from the CLI re-triggers on the next push
    anyway — so pushing a review fix also un-sticks it.
- A deploy job can read `in_progress`/`pending` with **all steps already
  `completed`** — that is GitHub finalization lag, not a hang. Don't rerun it;
  it flips to `pass` shortly.

### C. Preview

- Check issue comments for the sticky preview:
  ```bash
  gh api repos/craft-code-club/blog-c3/issues/PR/comments --jq '.[]|select(.body|test("Preview Url"))|.body'
  ```
- When it first appears, **report the `*.pages.dev` link to the user once**, and
  suggest the pages worth eyeballing for the change.

---

## Phase 4 — Stop condition

Stop the loop only when **all three** hold:

1. **0 unresolved review threads**, and
2. **all checks concluded with no failures or pendings**, and
3. the **preview URL has been reported**.

Then: `CronDelete <job-id>`, and give the user a final summary (checks green,
review resolved, preview link, PR ready for human review/merge). If the user says
"stop"/"para o loop" earlier, delete the cron immediately.

---

## Gotchas cheat-sheet

- **Push**: HTTPS URL + `gh auth setup-git`; SSH fails here.
- **Force-push after rebase**: `git push --force https://github.com/craft-code-club/blog-c3.git HEAD:<branch>` (a feature branch only you touch). `--force-with-lease` needs a fresh remote-tracking ref, which the HTTPS-URL push does not set.
- **Resolve threads**: GraphQL `resolveReviewThread` with a `$threadId` **variable**, never string-interpolated.
- **"Unhandled comments?"**: count unresolved threads, not `in_reply_to_id == null`.
- **CI `fail` at ~15m, 0 steps** = queue timeout (`cancelled`) → `gh run rerun`.
- **Validation gates**: `tsc --noEmit` + `npm run build`. ESLint throws
  (`eslint-plugin-react` vs ESLint 10) — ignore it.
- **`output: export`**: `generateStaticParams()` must **never** return an empty
  array for a dynamic route, or the build fails with *"is missing
  generateStaticParams()"*. `redirect()` works in export (emits a
  `NEXT_REDIRECT;replace;…;307` client redirect stub).
