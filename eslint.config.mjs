import { fixupConfigRules } from "@eslint/compat";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat config, so we spread it directly
// instead of going through FlatCompat (which is for legacy .eslintrc configs
// and corrupts an already-flat config).
//
// Some plugins it bundles still call context methods that ESLint 10 removed:
// eslint-plugin-react calls context.getFilename() and crashes on the first
// file. fixupConfigRules, from the ESLint team, adds the removed methods back.
// Once those plugins support ESLint 10 it does nothing, and it can go.
const eslintConfig = [
  ...fixupConfigRules([...coreWebVitals, ...typescript]),
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "next-env.d.ts",
      // Worktrees do Claude Code são cópias de trabalho com o próprio
      // eslint.config.mjs (e as próprias deps). Lintar daqui quebra a execução.
      ".claude/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
];

export default eslintConfig;
