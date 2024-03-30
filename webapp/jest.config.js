const path = require('node:path')
const { pathsToModuleNameMapper } = require('ts-jest')

const { name } = require('./package.json')
const { compilerOptions } = require('./tsconfig')

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  displayName: name,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  setupFiles: ['<rootDir>/__tests__/setupTests.ts'],
  testMatch: ['<rootDir>/__tests__/**/?(*.)(spec|test).[jt]s?(x)'],
  preset: 'ts-jest',
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
