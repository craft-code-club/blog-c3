---
name: npm-vulnerabilities-manager
description: Detect and fix npm/yarn/pnpm security vulnerabilities. Use for CVE or GHSA advisories, npm/yarn/pnpm audit results, Dependabot alerts, transitive dependency vulnerabilities, and security scans on JavaScript/Node.js projects. Covers audit-based detection, direct and transitive remediation, security-overrides.json annotation, GitHub advisory enrichment, build/runtime validation, and stale override cleanup.
---

# npm Vulnerabilities Manager

## Scope

- Detect vulnerable packages (direct and transitive) via `npm audit`, `yarn audit`, or `pnpm audit`.
- Remediate direct package vulnerabilities by upgrading the affected package.
- Remediate transitive vulnerabilities by adding an explicit version override in `package.json` (`overrides` for npm, `resolutions` for yarn, `pnpm.overrides` for pnpm).
- Annotate transitive overrides with a structured entry in `security-overrides.json` at the project root.
- Remove stale transitive overrides that are no longer required.
- Enrich findings with external advisory data from GitHub Dependabot, GitHub Advisory Database, and the npm advisory registry.
- Validate the project still builds and runs correctly after all remediations.

## Out of Scope

- Upgrading packages that have no security advisory (use a general dependency manager for that).
- Non-JavaScript package ecosystems (NuGet, pip, etc.).
- Direct `package.json` edits when an equivalent CLI command exists for direct dependency changes.

## Prerequisites

- The relevant package manager installed and available in `PATH` (`npm`, `yarn`, or `pnpm`).
- `node_modules` installed (run `npm install` / `yarn install` / `pnpm install` first if missing).
- Internet access for package resolution and advisory lookups.

## Core Rules

1. **CLI-first for direct dependencies**: Always use the package manager CLI to upgrade direct dependencies. Only edit `package.json` directly when no CLI alternative exists (e.g., adding `overrides`/`resolutions`/`pnpm.overrides` for transitive fixes).
2. **Annotate transitive overrides only**: Every entry added to `overrides`, `resolutions`, or `pnpm.overrides` specifically to force a safe transitive version must have a corresponding entry in `security-overrides.json`. Direct upgrades do not require annotation. See the [override specification](references/override-spec.md).
3. **No duplicate override annotations**: If a `security-overrides.json` entry for the same advisory and package already exists, update it rather than adding a new one.
4. **Verify after every change**: Re-run the audit command after each remediation to confirm the advisory no longer appears.
5. **Auto-cleanup**: When a stale transitive override is detected and confirmed no longer needed after validation, remove both the `package.json` override entry and the `security-overrides.json` annotation automatically.
6. **One change set at a time**: Remediate and verify one vulnerability before moving to the next to prevent cascading install failures.

---

## Phase 1: Detection

### Detect package manager

Check for lock files in the project root: `package-lock.json` → npm, `yarn.lock` → yarn, `pnpm-lock.yaml` → pnpm. If multiple exist, prefer the one matching the `packageManager` field in `package.json`; if unset, ask the user.

### Run the audit

```bash
# npm (outputs structured JSON)
npm audit --json

# yarn (classic v1)
yarn audit --json

# pnpm
pnpm audit --json
```

Parse the output and build a triage table:

| Package | Version | Advisory | Severity | Type |
|---------|---------|---------|----------|------|
| lodash | 4.17.4 | CVE-2021-23337 | High | direct |
| minimist | 1.2.5 | CVE-2021-44906 | Critical | transitive |

**Type classification rules**:
- `direct` — appears under `dependencies` or `devDependencies` in `package.json`.
- `transitive` — flagged by the audit but NOT a direct dependency in `package.json`; it is pulled in by another package.

When a GHSA/CVE ID or Dependabot URL is mentioned, read [advisory-sources.md](references/advisory-sources.md) to enrich the finding. If no URL is provided, derive it via `git remote -v` (see advisory-sources.md Section 2 for derivation rules). If no GitHub remote is found, skip Dependabot enrichment.

---

## Phase 2: Triage

For each vulnerability, determine the remediation path before acting:

1. **Check if a fixed version exists**:
   ```bash
   npm view <package-name> versions --json
   # or
   npm info <package-name> dist-tags
   ```
   Identify the lowest version ≥ current that does not carry the advisory.

2. **Detect workspace / monorepo mode**:
   - `"workspaces"` key in root `package.json` → npm/yarn workspaces. Run audit at the workspace root; overrides placed at the root apply to all workspace packages.
   - `pnpm-workspace.yaml` present → pnpm workspace. Same principle.

3. **Check for prior overrides**: Look for existing entries in `overrides`/`resolutions`/`pnpm.overrides` in `package.json` and matching entries in `security-overrides.json`. If one exists for the same package but with an outdated version, update the version and annotation rather than adding a new entry.

---

## Phase 3: Remediation

### 3a — Direct vulnerability

The vulnerable package is listed under `dependencies` or `devDependencies` in `package.json`:

```bash
# npm
npm install <package-name>@<safe-version>

# yarn
yarn upgrade <package-name>@<safe-version>

# pnpm
pnpm update <package-name>@<safe-version>
```

Re-run the audit to verify the advisory is resolved. For direct vulnerabilities, no `security-overrides.json` entry is required.

### 3b — Transitive vulnerability

The vulnerable package is NOT a direct dependency; it is pulled in by another package.

**Step 1**: Add a version override in `package.json` to force the safe version. See [override-spec.md](references/override-spec.md) for the JSON syntax (`overrides` for npm, `resolutions` for yarn, `pnpm.overrides` for pnpm).

**Step 2**: Re-install to apply the override: `npm install` / `yarn install` / `pnpm install`

**Step 3**: Add an annotation entry to `security-overrides.json` at the project root to explain why the override exists. Read [override-spec.md](references/override-spec.md) for the full schema.

Example `security-overrides.json` entry:

```json
{
  "overrides": [
    {
      "package": "minimist",
      "override-type": "transitive",
      "advisory": "CVE-2021-44906",
      "pulled-by": "mocha >= 7.0.0",
      "fixed-version": "1.2.6",
      "reason": "Prototype pollution vulnerability allowing arbitrary code execution; explicit override forces safe transitive version."
    }
  ]
}
```

**Step 4**: Re-run the audit to confirm the advisory is resolved.

#### Workspace note

For monorepos: place overrides and `security-overrides.json` at the workspace root and run install from the root.

### 3c — Stale override cleanup

After upstream dependencies have been updated, a transitive override added for a past CVE may no longer be needed.

**Detection**:
1. Find entries in `security-overrides.json` with `"override-type": "transitive"`.
2. For each, check whether the current parent package(s) named in `pulled-by` now bundles a version ≥ the `fixed-version` in the annotation.
3. Remove the override key from `package.json`, then run `npm install` / `yarn install` / `pnpm install`.
4. Re-run the audit:
   - If advisory no longer appears → override is stale. Keep it removed and delete the entry from `security-overrides.json`.
   - If the vulnerability reappears → restore the override entry and annotation, report that it is still required.

### 3d — Unresolvable vulnerabilities

When no safe version is available yet (the advisory is open with no patch):

- Do not force an insecure or unreleased version.
- Report the advisory ID, affected package, current version, and the fact that no patched release exists.
- Suggest watching the advisory URL for a fix and note any known mitigations (e.g., disabling a specific feature flag).

---

## Phase 4: Verification

After all remediations are applied, run a final audit: `npm audit --json` / `yarn audit --json` / `pnpm audit --json`

If the audit still reports vulnerabilities, re-enter Phase 3 for the remaining findings before proceeding to Phase 5.

---

## Phase 5: Build & Runtime Validation

After the audit is clean, validate that the project still builds and runs correctly. A package upgrade or transitive override can occasionally introduce a breaking API change.

### 5a — Detect available scripts

Run `npm run` / `yarn run` / `pnpm run` to list defined scripts.

### 5b — Run tests (if a `test` script is defined)

Run `npm test` / `yarn test` / `pnpm test`. If tests fail, check whether the failure pre-dates the security fix before reverting.

### 5c — Build (if a `build` script is defined)

Run `npm run build` / `yarn build` / `pnpm build`.

### 5d — Dev server / smoke-test (if a `dev`, `start`, or `serve` script is defined)

Run the first available script from `dev`, `start`, or `serve` (e.g., `npm run dev`, `yarn start`, `pnpm dev`). Run briefly to confirm startup, then stop it (Ctrl+C).

### Failure handling

If a build or test step fails after the security fix:
1. Temporarily revert the change and re-run to determine if the failure is pre-existing.
2. If pre-existing, report it separately — it is not caused by the security fix.
3. If introduced by the upgrade, inspect the package changelog for breaking changes and find a compatible patched version.
4. Do not leave the project in a broken state — restore a working configuration before reporting.

---

## Override Specification

Read [override-spec.md](references/override-spec.md) for:
- Full field definitions and allowed values for `security-overrides.json`.
- Templates for transitive and workspace override placement.
- Idempotency rules (when to create vs. update an existing entry).

---

## Worked Examples

### Example 1 — Direct vulnerability fix

**User**: "lodash is flagged for CVE-2021-23337 in my project."

**Steps**:
1. `npm audit --json` → confirms `lodash 4.17.4` is a direct dependency, `High`.
2. `npm view lodash versions --json` → identifies `4.17.21` as the patched release.
3. `npm install lodash@4.17.21`
4. `npm audit --json` → clean.
5. No `security-overrides.json` entry is added because this is a direct package upgrade.

### Example 2 — Transitive vulnerability fix

**User**: "My project flags minimist for CVE-2021-44906 as a transitive dependency pulled by mocha."

**Steps**:
1. Confirm `minimist` is not in `dependencies`/`devDependencies` in `package.json`.
2. Identify parent package `mocha` from audit output.
3. Determine patched version `1.2.6` from the audit output or `npm view minimist versions --json`.
4. Add `"overrides": { "minimist": "1.2.6" }` to `package.json`.
5. `npm install`
6. `npm audit --json` → clean.
7. Add entry to `security-overrides.json` with `"override-type": "transitive"`, advisory IDs, `pulled-by`, `fixed-version`, and `reason`.

### Example 3 — Stale override removal

**User**: "Check if the ansi-regex override we added last year is still needed now that we upgraded jest."

**Steps**:
1. Find `ansi-regex` entry in `security-overrides.json` with `"override-type": "transitive"`.
2. Remove `"ansi-regex"` from `"overrides"` in `package.json`.
3. `npm install`
4. `npm audit --json` → clean (parent `jest` now bundles safe version).
5. Remove the `ansi-regex` entry from `security-overrides.json` permanently.

### Example 4 — pnpm transitive vulnerability fix with validation

**User**: "I use pnpm. My audit flags semver for CVE-2022-25883 as transitive, pulled by jest."

**Steps**:
1. Confirm `pnpm-lock.yaml` is present → use pnpm.
2. `pnpm audit --json` → confirms `semver` is transitive, `High`.
3. Confirm `semver` is not in `dependencies`/`devDependencies` in `package.json`.
4. Identify parent package `jest` from audit output.
5. `npm view semver versions --json` → identifies `7.5.2` as the patched release.
6. Add `"pnpm": { "overrides": { "semver": "7.5.2" } }` to `package.json`.
7. `pnpm install`
8. `pnpm audit --json` → clean.
9. Add entry to `security-overrides.json` with `"override-type": "transitive"`, CVE advisory, `pulled-by`, `fixed-version`, and `reason`.
10. Run `pnpm run` to check available scripts. Run `pnpm test` and `pnpm build` (if scripts are defined) to confirm the project still works.
