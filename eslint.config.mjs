import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Global rules
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "prefer-const": "warn"
    }
  },
  {
    // File-specific overrides
    files: ["app/actions/rider.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off"
    }
  }
];

export default eslintConfig;