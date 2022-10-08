/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots:["<rootDir>/src"],
  clearMocks:true,
  coverageProvider:"v8",
  testMatch: ["**/__tests__/*.+(ts|tsx|js)"],
  transform:{"^.+\\.(ts|tsx)$":"ts-jest"}
};