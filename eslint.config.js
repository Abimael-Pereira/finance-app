import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import jest from 'eslint-plugin-jest';
import pluginJest from 'eslint-plugin-jest';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended'],
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: { globals: globals.node },
    },
    {
        files: ['**/*.test.js', '**/*.spec.js'],
        plugins: { jest: pluginJest },
        rules: jest.configs.recommended.rules,
        languageOptions: {
            globals: pluginJest.environments.globals.globals,
        },
    },
]);
