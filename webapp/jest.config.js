const path = require('node:path')

const { name } = require('./package.json')

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  displayName: name,
  setupFiles: ['<rootDir>/__tests__/setupTests.ts'],
  testMatch: ['<rootDir>/__tests__/**/?(*.)(spec|test).[jt]s?(x)'],
  preset: 'vite-jest',
  clearMocks: true,
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname),
  coverageProvider: 'babel',
  collectCoverageFrom: [
    './src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/dist/**'
  ]
}
