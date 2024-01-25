import { writeFile } from "fs/promises";

import { asyncExec } from "~/helpers/asyncExec";

export const addLint = async () => {
  const deps = {
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-isaacscript": "^2.6.7",
    "eslint-plugin-prettier": "^5.0.1",
    "eslint-config-prettier": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "6.0.0",
    "@typescript-eslint/parser": "6.0.0",
    eslint: "^8.40.0",
    "@types/eslint": "^8.37.0",
    "@ianvs/prettier-plugin-sort-imports": "^4.1.1",
    prettier: "^3.2.4",
  };

  await asyncExec(`pnpm add ${Object.keys(deps).join(" ")} -D`);

  const prettierConfigContent = `
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
  `;

  const eslintConfigContent = `/** @type {import("eslint").Linter.Config} */
  const config = {
      root: true,
      parser: "@typescript-eslint/parser",
      plugins: ["isaacscript", "import"],
      extends: [
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:prettier/recommended",
      ],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: [
          "./tsconfig.json",
        ],
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { prefer: "type-imports", fixStyle: "inline-type-imports" },
        ],
        "import/consistent-type-specifier-style": ["error", "prefer-inline"],
    
        "isaacscript/complete-sentences-jsdoc": "warn",
        "isaacscript/format-jsdoc-comments": "warn",
    
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
    
        "@typescript-eslint/prefer-nullish-coalescing": "off",
      },
    };
    
    module.exports = config;`;

  await writeFile("prettier.config.mjs", prettierConfigContent);
  await writeFile(".eslintrc.cjs", eslintConfigContent);
};
