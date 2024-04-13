module.exports = {
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['.eslintrc.js'],
    parserOptions: {
        createDefaultProgram: true,
        project: 'tsconfig.json',
        sourceType: 'module',
        warnOnUnsupportedTypeScriptVersion: false
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    root: true,
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-require-imports': 'warn',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
}
