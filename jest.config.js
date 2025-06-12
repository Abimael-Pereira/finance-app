/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    watchPathIgnorePatterns: [
        '<rootDir>/coverage/',
        '<rootDir>/postgres-data/',
        '<rootDir>/jest.global-setup.json',
        '<rootDir>/jest.setup-after-env.json',
        '<rootDir>/node_modules/',
    ],
    collectCoverageFrom: ['src/**/*.js'],
    testPathIgnorePatterns: ['/node_modules/', '/postgres-data/'],
    globalSetup: '<rootDir>/jest.global-setup.js',
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
};

export default config;
