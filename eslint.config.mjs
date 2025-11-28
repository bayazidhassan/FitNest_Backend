// import js from "@eslint/js";
// import { defineConfig } from "eslint/config";
// import globals from "globals";
// import tseslint from "typescript-eslint";

// export default defineConfig([
//   {
//     files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
//     plugins: { js },
//     extends: ["js/recommended"],
//     languageOptions: { globals: globals.node },
//   },
//   { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
//   tseslint.configs.recommended,
// ]);

import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  // 1️⃣ JS files
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: ["js", "prettier"],
    extends: ["plugin:js/recommended", "plugin:prettier/recommended"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs", // match Node.js CommonJS modules
    },
    rules: {
      eqeqeq: "off",
      "no-unused-vars": "error",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
      "no-unused-expressions": "error",
      "no-console": "warn",
      "no-undef": "error",
    },
  },

  // 2️⃣ TypeScript files
  {
    files: ["**/*.{ts,mts,cts}"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      project: "./tsconfig.json", // enables type-aware linting
    },
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      eqeqeq: "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/no-unused-expressions": "error",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
      "no-console": "warn",
    },
  },

  // 3️⃣ Ignore generated files
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
]);
