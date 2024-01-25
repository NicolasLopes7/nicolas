const config = {
  arrowParens: "always",
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  tabWidth: 2,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  tailwindConfig: "./template/extras/config/tailwind.config.ts",
  trailingComma: "es5",
  importOrder: ["<THIRD_PARTY_MODULES>", "", "^~/", "^[.][.]/", "^[.]/"],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "4.4.0",
};

export default config;
