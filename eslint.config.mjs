import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        React: "readonly",
      },
    },
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // General rules
      "react/react-in-jsx-scope": "off",
      "no-undef": "error",
      
      // Unused vars rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],
      
      // Other rules
      "prefer-const": ["warn", {
        "destructuring": "all",
        "ignoreReadBeforeAssign": true
      }],
      "@next/next/no-html-link-for-pages": "off",
      
      // Disable unused eslint-disable warnings
      // "eslint-comments/no-unused-disable": "error"
    }
  },
  {
    files: ["**/components/ui/**"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
];