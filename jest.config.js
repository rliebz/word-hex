/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__jest__/mock.ts",
    "\\.(css|less)$": "<rootDir>/__jest__/mock.ts"
  },
  testEnvironment: 'jest-environment-jsdom',
};
