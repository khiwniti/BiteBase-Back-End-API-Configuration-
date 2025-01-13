module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 60000, // Set timeout to 60 seconds
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/config/'
  ],
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    transformIgnorePatterns: ['/node_modules/(?!ioredis)'],
  };
