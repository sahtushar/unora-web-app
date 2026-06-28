import path from "node:path";
import {fileURLToPath} from "node:url";

import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import jest from "eslint-plugin-jest";
import perfectionist from "eslint-plugin-perfectionist";
import unusedImports from "eslint-plugin-unused-imports";
import {defineConfig, globalIgnores} from "eslint/config";
import globals from "globals";

const typescriptCoreOverrides = {"no-undef": "off", "no-redeclare": "off"};

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

const sortInterfaceAndTypeConfig = {
  type: "natural",
  order: "asc",
  ignoreCase: true,
  groups: [
    "required-property",
    "optional-property",
    "index-signature",
    "required-method",
    "optional-method",
  ],
  customGroups: [
    {
      groupName: "required-property",
      selector: "property",
      modifiers: ["required"],
    },
    {
      groupName: "optional-property",
      selector: "property",
      modifiers: ["optional"],
    },
    {groupName: "required-method", selector: "method", modifiers: ["required"]},
    {groupName: "optional-method", selector: "method", modifiers: ["optional"]},
  ],
};

export default defineConfig([
  globalIgnores(["**/node_modules/*", "**/dist/*", "**/drizzle/meta/*"]),
  js.configs.recommended,
  {
    files: ["**/api/**/*.ts", "**/src/**/*.ts", "**/test/**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      jest,
      "unused-imports": unusedImports,
      perfectionist,
    },
    languageOptions: {
      globals: {...globals.node},
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: path.join(repoRoot, "eslint/tsconfig.json"),
        tsconfigRootDir: repoRoot,
      },
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...prettierConfig.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/strict-boolean-expressions": 1,
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-duplicate-enum-values": "off",
      curly: ["error", "all"],
      ...typescriptCoreOverrides,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "perfectionist/sort-interfaces": ["error", sortInterfaceAndTypeConfig],
      "perfectionist/sort-object-types": ["error", sortInterfaceAndTypeConfig],
    },
  },
]);
