module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.spec.ts'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  coverageDirectory: 'coverage'
};
