/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm-legacy",
  testEnvironment: "node",
  prettierPath: require.resolve("prettier-2"),
  collectCoverageFrom: ["src/index.ts"],
  coverageReporters: ["json", "lcov", "text"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
