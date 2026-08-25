# Advisory Sources Reference

Use these sources to enrich a vulnerability finding with advisory details (severity, affected versions, patched version, CVE/GHSA IDs, description) before deciding on a remediation target version.

**Priority order**: Local audit output (`npm audit --json`) first. Use external sources to fill in missing advisory context — patched version, full CVE/GHSA ID, severity, and description.

---

## 1. npm Audit JSON Output (Primary)

```bash
npm audit --json
```

Key fields in the JSON response:
- `vulnerabilities.<package>.severity` — `info`, `low`, `moderate`, `high`, or `critical`.
- `vulnerabilities.<package>.via` — Array of direct advisories or package names causing the transitive chain.
- `vulnerabilities.<package>.fixAvailable` — `true`/`false` or an object with `name` and `version` of the fix.
- `vulnerabilities.<package>.range` — Affected version range.

When `via` contains a string (package name), the vulnerability is transitive — follow the chain to find the root advisory object.

---

## 2. GitHub Dependabot Alerts

When the user provides a GitHub repository URL or Dependabot alert, use the following patterns to retrieve alert details.

If the user does not provide a Dependabot URL, derive it from git remotes first:

```bash
git remote -v
```

Derivation rules:
- Prefer remote `origin` when it points to GitHub.
- If `origin` is not GitHub, select another GitHub remote if available.
- Support both remote formats:
  - `https://github.com/<owner>/<repo>.git`
  - `git@github.com:<owner>/<repo>.git`
- Extract `<owner>/<repo>` and construct:
  - `https://github.com/<owner>/<repo>/security/dependabot`

If no GitHub remote exists, git is unavailable, or parsing fails, skip Dependabot lookup and continue with GitHub Advisory Database and npm advisory sources.

### Dependabot alerts page

```
https://github.com/<owner>/<repo>/security/dependabot
```

Each alert card shows:
- Package name and ecosystem (look for `npm`).
- Current version vs. patched version.
- GHSA advisory ID and link.
- Auto-dismiss/close status.

---

## 3. GitHub Advisory Database

Use when you have a GHSA ID or CVE and need the full advisory record independently of a specific repo.

### GHSA lookup URL

```
https://github.com/advisories/<GHSA-xxxx-xxxx-xxxx>
```

The page shows:
- Published / updated dates.
- Affected package, ecosystem (`npm`), version range, patched version.
- CVSS score and vector.
- References (including CVE).

---

## 4. npm Advisory Registry

Use when `npm audit --json` does not include the full patched-version range or CVE ID.

### npm advisory REST endpoint

```bash
curl "https://registry.npmjs.org/-/npm/v1/security/advisories/<advisory-id>"
```

Key response fields:
- `cves` — Array of CVE IDs.
- `github_advisory_id` — GHSA identifier.
- `severity` — Severity level.
- `vulnerable_versions` — Semver range of affected versions.
- `patched_versions` — Semver range of patched versions.
- `recommendation` — Human-readable remediation advice.

---

## 5. npm Package Versions

Use to find the lowest safe published version when the advisory only gives a range.

```bash
# List all published versions
npm view <package-name> versions --json

# Get latest dist-tag
npm info <package-name> dist-tags
```

Cross-reference candidate versions against the advisory's `patched_versions` semver range to confirm a version is safe.

---

## 6. Cross-Reference and ID Normalization

| Source provides | Cross-reference to get |
|----------------|------------------------|
| CVE only | Search `https://github.com/advisories?query=<CVE-ID>` to get GHSA |
| GHSA only | Advisory page shows CVE reference if assigned |
| npm advisory ID | Response includes `github_advisory_id` (GHSA) and `cves` array |

When both CVE and GHSA are available, record both in the `advisory` field of the `security-overrides.json` entry (comma-separated), e.g., `CVE-2021-44906, GHSA-xvch-5gv4-984h`.

---

## Confidence Ranking

When sources provide conflicting patched-version information, use this priority:

1. `npm audit --json` `fixAvailable.version` (most authoritative for the local resolved dependency graph).
2. GitHub Advisory Database `firstPatchedVersion.identifier` for the npm package.
3. npm advisory registry `patched_versions` semver range.
4. Dependabot alert `security_vulnerability.first_patched_version.identifier` (from user-provided or git-remote-derived URL).

If all agree, proceed with confidence. If they disagree, use the highest patched version to be safe, and note the discrepancy in the `reason` field of the `security-overrides.json` entry.
