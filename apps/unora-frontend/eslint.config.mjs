import path from "node:path";
import {fileURLToPath} from "node:url";

// External packages
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import jest from "eslint-plugin-jest";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybookPlugin from "eslint-plugin-storybook";
import unusedImports from "eslint-plugin-unused-imports";
import {defineConfig, globalIgnores} from "eslint/config";
import globals from "globals";

// TypeScript handles undefined variables and global redeclaration; disable for .ts/.tsx to avoid false positives.
const typescriptCoreOverrides = {"no-undef": "off", "no-redeclare": "off"};

/** Repo root — stabilizes `parserOptions.project` when ESLint’s cwd isn’t the package root (e.g. IDE). */
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
  globalIgnores([
    "**/scripts/*",
    "**/node_modules/*",
    "**/build/*",
    "**/libs/*",
    "**/dist/*",
    ".storybook/**/*",
  ]),
  js.configs.recommended,
  ...storybookPlugin.configs["flat/recommended"],
  {
    files: ["**/src/**/*.ts", "**/src/**/*.tsx"],
    ...react.configs.flat.recommended,
    plugins: {
      ...react.configs.flat.recommended.plugins,
      react,
      "@typescript-eslint": typescriptEslint,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      jest,
      "unused-imports": unusedImports,
      perfectionist,
    },
    languageOptions: {
      globals: {...globals.browser},
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: path.join(repoRoot, "eslint/tsconfig.json"),
        tsconfigRootDir: repoRoot,
      },
    },
    settings: {
      react: {
        createClass: "createReactClass",
        pragma: "React",
        version: "detect",
        flowVersion: "0.53",
      },
      propWrapperFunctions: [
        "forbidExtraProps",
        {property: "freeze", object: "Object"},
        {property: "myFavoriteWrapper"},
      ],
      linkComponents: ["Hyperlink", {name: "Link", linkAttribute: "to"}],
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...typescriptEslint.configs.recommended.rules,
      ...prettierConfig.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "react-refresh/only-export-components": "off",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "import/no-anonymous-default-export": "off",
      eqeqeq: "off",
      "@typescript-eslint/strict-boolean-expressions": 1,
      "@typescript-eslint/no-unused-expressions": ["error", {allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true}],
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
  {
    files: ["**/src/**/*.ts", "**/src/**/*.tsx"],
    rules: {"react/prop-types": "off"},
  },
]);
