module.exports = {
  extends: ['@leftonread/eslint-config', 'erb'],
  rules: {
    // BEGIN: A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    // END
    'import/prefer-default-export': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.js'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
