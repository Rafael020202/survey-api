module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.spec.ts'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  coverageDirectory: 'coverage'
};
