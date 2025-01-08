/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};