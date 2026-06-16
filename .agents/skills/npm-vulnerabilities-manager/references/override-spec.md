# Override Specification

Transitive override annotations are required only for entries added to `overrides`, `resolutions`, or `pnpm.overrides` in `package.json` specifically to force a safe version of a vulnerable transitive dependency. Direct package upgrades do not require annotation.

Because `package.json` is JSON and does not support inline comments, annotations are maintained in a companion file — `security-overrides.json` — at the project root (or workspace root for monorepos). This file documents the reason behind each override so future developers understand why an otherwise-indirect package is pinned.

---

## security-overrides.json Schema

```json
{
  "overrides": [
    {
      "package": "<npm-package-name>",
      "override-type": "transitive",
      "advisory": "<CVE-YYYY-NNNNN>, <GHSA-xxxx-xxxx-xxxx>",
      "pulled-by": "<parent-package> >= <version>",
      "fixed-version": "<semver>",
      "reason": "<vulnerability class and brief impact description>; explicit override forces safe transitive version."
    }
  ]
}
```

---

## Field Definitions

| Field | Required | Values | Notes |
|-------|----------|--------|-------|
| `package` | yes | npm package name (string) | The vulnerable package that is a transitive dependency |
| `override-type` | yes | `"transitive"` | Marks this entry as a transitive vulnerability override |
| `advisory` | yes | Comma-separated CVE/GHSA IDs | Use both CVE and GHSA when available; use whichever is known if only one exists |
| `pulled-by` | yes | `"<ParentPackage> >= <version>"` | The direct dependency that pulls in the vulnerable transitive package |
| `fixed-version` | yes | SemVer string | The version that resolves the advisory |
| `reason` | yes | Free text | Human-readable explanation; include the vulnerability class and impact |

---

## Templates

### npm — add override entry in package.json

```json
{
  "overrides": {
    "minimist": "1.2.6"
  }
}
```

### yarn — add resolution entry in package.json

```json
{
  "resolutions": {
    "minimist": "1.2.6"
  }
}
```

### pnpm — add override entry in package.json

```json
{
  "pnpm": {
    "overrides": {
      "minimist": "1.2.6"
    }
  }
}
```

### security-overrides.json entry

```json
{
  "overrides": [
    {
      "package": "minimist",
      "override-type": "transitive",
      "advisory": "CVE-2021-44906, GHSA-xvch-5gv4-984h",
      "pulled-by": "mocha >= 7.0.0",
      "fixed-version": "1.2.6",
      "reason": "Prototype pollution vulnerability allowing arbitrary code execution; explicit override forces safe transitive version."
    }
  ]
}
```

---

## Placement Rules

1. **security-overrides.json location**: Always at the project root (or workspace root for monorepos). Never inside individual workspace package directories.
2. **package.json override location**: For workspaces, overrides/resolutions always go in the root `package.json`, not in individual workspace `package.json` files.
3. **One entry per package+advisory pair**: Each distinct combination of `package` and `advisory` gets its own entry. If one package has two separate advisories, create two entries.
4. **Ordering**: Append new entries to the end of the `"overrides"` array in `security-overrides.json`. No required ordering, but keep the file sorted by `package` name for readability when multiple entries exist.
5. **Empty file**: If all overrides are removed, leave `security-overrides.json` with `{ "overrides": [] }` rather than deleting the file.

---

## Advisory ID Normalization

When only one identifier is known:
- If only a CVE is available: use `"CVE-YYYY-NNNNN"` and omit the GHSA identifier rather than leaving it blank.
- If only a GHSA is available: use `"GHSA-xxxx-xxxx-xxxx"` and omit the CVE identifier.
- Do not use placeholder text like `"GHSA-unknown"` or `"CVE-unknown"`.

---

## Idempotency Rules

These rules prevent duplicate entries accumulating over time:

1. **Same package + same advisory already annotated**: If an entry for the exact same `package` and `advisory` ID(s) already exists in `security-overrides.json`, do not add a new entry. Only update the `fixed-version` and `reason` fields if the version changed.
2. **Same package + different advisory**: Add a new entry for the additional advisory. Each distinct advisory gets its own entry.
3. **Version downgrade never allowed**: Do not replace a higher `fixed-version` with a lower one, even if the advisory only specifies a minimum safe version that is lower.
