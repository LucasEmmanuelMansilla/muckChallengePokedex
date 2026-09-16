module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/fixtures/',
    '/__tests__/helpers/',
  ],
  collectCoverageFrom: [
    'App.{ts,tsx}',
    'src/**/*.{ts,tsx}',
    '!src/domain/**',
    '!src/assets/**',
  ],
};
