module.exports = {
  bracketSpacing: false,
  bracketSameLine: true,
  trailingComma: "es5",
  printWidth: 80,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
