module.exports = {
    mode: 'modules',
    out: 'docs',
    preserveConstEnums: true,
    ignoreCompilerErrors: true,
    exclude: [
        // '**/node_modules/**',
        '**/*.spec.ts',
        '**/tests/**/*.ts'],
    name: 'g.frame',
    // "external-modulemap": ".*packages\/.*",
    excludePrivate: true,
    theme: "minimal",
    excludeNotExported: true,
    inputFiles: ['**/src/index.ts']
};