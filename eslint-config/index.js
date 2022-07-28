module.exports = {
  plugins: ['simple-import-sort'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'simple-import-sort/imports': 'error',
  },
}
