module.exports = {
  roots: ["src"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: "coverage",
  modulePathIgnorePatterns: ["<rootDir>/utils/testHelper.ts"],
};
