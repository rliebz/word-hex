module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "prettier",
    "plugin:react/recommended",
    "plugin:vitest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["dist/**/*"],
  plugins: ["@typescript-eslint", "react", "vitest"],
  rules: {
    "import/extensions": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "vite.config.ts",
          "vitest.config.ts",
          "**/*.test.ts",
          "**/*.test.tsx",
        ],
      },
    ],
    "no-continue": "off",
    "no-nested-ternary": "off",
    "no-restricted-syntax": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [2, { extensions: [".jsx", ".tsx"] }],
  },
};
