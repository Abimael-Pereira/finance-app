/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    watchPathIgnorePatterns: ['<rootDir>/postgres-data/'],
    collectCoverageFrom: ['src/**/*.js'],
    testPathIgnorePatterns: ['/node_modules/', '/postgres-data/'],
    globalSetup: '<rootDir>/jest.global-setup.mjs',
};

export default config;
