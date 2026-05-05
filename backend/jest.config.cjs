module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
};


// This file tells ts-jest to run TypeScript
// run tests in a Node environment
// look for files ending in .test.ts inside backend/tests/