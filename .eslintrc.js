module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: ["airbnb", "plugin:react/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 13,
    sourceType: "module"
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"]
      }
    }
  },
  ignorePatterns: ["dist/**/*"],
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "import/extensions": "off",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.test.ts", "**/*.test.tsx"] }
    ],
    "no-continue": "off",
    "no-nested-ternary": "off",
    "no-restricted-syntax": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [2, { extensions: [".jsx", ".tsx"] }]
  }
};
