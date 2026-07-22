---
name: git-commit
description: "Create high-quality git commits that follow Conventional Commits and semantic-release best practices. Inspect the working tree, split changes into logical commits, stage precisely, and write well-formed conventional commit messages (type(scope): subject, body, footers). Use when the user asks to commit, craft a commit message, stage changes, split work into multiple commits, or wants messages that drive semantic-release version bumps."
---

# Git Commit

Produce commits that are easy to review, safe to ship, and machine-readable by semantic-release. Every commit follows the Conventional Commits 1.0.0 specification so that CHANGELOG generation and SemVer version bumps happen automatically. This skill covers the full workflow: inspect, decide boundaries, stage precisely, review, then write the message and commit.

## When to Use

- The user asks to commit changes or stage work.
- The user asks you to craft or fix a commit message.
- Changes need to be split into multiple logical commits.
- The user wants messages that drive semantic-release (automatic version bumps / changelog).

## When Not to Use

- Authoring pull request descriptions or release notes (commit-level only).
- Non-git version control systems.
- Rewriting already-published history (that requires explicit user confirmation and is out of scope here).

## Inputs (ask only if missing)

| Input                              | Required | Default if unspecified                            |
| ---------------------------------- | -------- | ------------------------------------------------- |
| Single commit or multiple commits? | No       | Multiple small commits when changes are unrelated |
| Required or preferred scope(s)     | No       | Scope is optional; add one when it adds clarity   |
| Max subject length override        | No       | 50–72 characters                                  |

## Commit Message Format

Conventional Commits structure:

```
<type>(<scope>): <short subject>

<body>

<footer(s)>
```

Rules:

- **Header** is `<type>(<scope>): <short subject>`.
  - `type` MUST be one of the types in the Type Reference section below.
  - `scope` is OPTIONAL, a noun in parentheses describing the affected area, e.g. `fix(parser):`.
  - `subject` is in present/imperative tense, lowercase first letter, **no trailing period**.
  - Keep the subject to **72 characters or fewer** (aim for the 50–72 range for descriptive subjects). A shorter subject-only commit is fine when it fully conveys the change.
- **Body** is OPTIONAL and begins **one blank line** after the subject.
  - Add a body only when the subject cannot fully describe the change.
  - Wrap body lines at **100 characters**.
  - Explain **why** the change was made, not an implementation diary.
  - Use bullet points or short paragraphs only for complex or multi-part changes.
- **Footer(s)** are OPTIONAL and begin one blank line after the body.
  - Use for breaking changes (`BREAKING CHANGE: ...`) or to reference issues/tickets (e.g. `Refs: #123`).
  - Footer tokens use `-` in place of spaces (e.g. `Reviewed-by:`), except `BREAKING CHANGE`.

## Type Reference

`type` MUST be one of the following:

| Type       | Use when                                                            |
| ---------- | ------------------------------------------------------------------- |
| `feat`     | Introducing a new feature                                           |
| `fix`      | Fixing a bug                                                        |
| `refactor` | Restructuring code without changing behavior (not a fix or feature) |
| `perf`     | Improving performance                                               |
| `docs`     | Documentation-only changes                                          |
| `build`    | Build system or dependency changes (mention old → new versions)     |
| `style`    | Formatting/whitespace only, no behavior change                      |
| `test`     | Adding or changing tests only                                       |
| `ci`       | CI/CD configuration or script changes                               |
| `chore`    | Maintenance that doesn't touch src or tests                         |
| `merge`    | Merging a branch into another branch                                |
| `revert`   | Reverting a previous commit                                         |

> Casing: any casing is technically valid, but be consistent, use lowercase types.
> If a change fits more than one type, split it into multiple commits.

## Breaking Changes

A breaking change triggers a **major** version bump regardless of type. Indicate it in either (or both) of these ways:

1. Append `!` after the type/scope: `feat(api)!: drop support for Node 6`
2. Add a footer (token MUST be uppercase):

```
feat: allow config object to extend other configs

BREAKING CHANGE: `extends` key is now used for extending other config files
```

If `!` is used, the `BREAKING CHANGE:` footer MAY be omitted and the subject describes the break.

## Workflow

1. **Inspect the working tree before staging.**
   - `git status`
   - `git diff` (unstaged); for large diffs use `git diff --stat` first.
2. **Decide commit boundaries (split when needed).**
   - Split by: feature vs. refactor, backend vs. frontend, formatting vs. logic, tests vs. prod code, dependency bumps vs. behavior changes.
   - If unrelated changes are mixed in one file, plan to use patch staging.
3. **Stage only what belongs in the next commit.**
   - Prefer patch staging for mixed changes: `git add -p`.
   - Unstage a hunk/file with `git restore --staged -p` or `git restore --staged <path>`.
4. **Review what will actually be committed.**
   - `git diff --cached`.
   - Sanity checks: no secrets/tokens, no stray debug logging, no unrelated formatting churn.
5. **Describe the staged change in 1–2 sentences** (what + why) before writing the message.
   - If you can't describe it cleanly, the commit is too big or mixed, return to step 2.
6. **Write the commit message** following the format above.
   - Choose the type deliberately (see SemVer mapping).
   - Use an editor for multi-line messages: `git commit -v`.
7. **Run the smallest relevant verification** (fastest meaningful unit test, lint, or build).
8. **Repeat** for the next commit until the working tree is clean.

## Examples

Subject-only:

```
docs: correct spelling of CHANGELOG
```

With scope:

```
feat(lang): add polish language
```

Breaking change with `!`:

```
feat(api)!: send an email to the customer when a product is shipped
```

Body + footers:

```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss incoming
responses other than from the latest request.

Reviewed-by: Z
Refs: #123
```

Dependency bump (mention versions):

```
build(deps): bump eslint from 8.57.0 to 9.0.0
```

## Validation

- [ ] Header matches `type(scope): subject`; type is from the reference table.
- [ ] Subject is ≤72 chars (aim for 50–72 when descriptive), present tense, lowercase first letter, no trailing period.
- [ ] Body (if any) is separated by a blank line, wrapped at 100 chars, explains _why_.
- [ ] Breaking changes use `!` and/or an uppercase `BREAKING CHANGE:` footer.
- [ ] `git diff --cached` contains only intended, logically-scoped changes (no secrets/debug/churn).
- [ ] The chosen type produces the intended semantic-release version bump.

## Common Pitfalls

| Pitfall                                    | Solution                                                   |
| ------------------------------------------ | ---------------------------------------------------------- |
| Mixed unrelated changes in one commit      | Split with `git add -p`; one logical change per commit     |
| Subject capitalized or ends with a period  | Lowercase the first letter; drop the trailing period       |
| Wrong type (e.g. `refactor` for a bug fix) | Match the type to intent; it controls the version bump     |
| Breaking change not flagged                | Add `!` and/or `BREAKING CHANGE:` footer so it bumps major |
| `BREAKING CHANGE` written in lowercase     | The footer token MUST be uppercase                         |
| Body used as an implementation diary       | Explain _why_, not a step-by-step of what changed          |
| Committing secrets or debug logs           | Review `git diff --cached` before every commit             |
