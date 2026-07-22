import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat config, so we spread it directly
// instead of going through FlatCompat (which is for legacy .eslintrc configs
// and corrupts an already-flat config).
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
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
