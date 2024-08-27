/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset:'ts-jest',
  resolver:"./jest/resolver.cjs",
  // testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$": ["ts-jest",{
      tsconfig:'tsconfig/tsconfig.jest.json'
    }],
  },
};