module.exports = {
  extends: 'erb/typescript',
  rules: {
    // BEGIN: A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    // END: A temporary hack related to IDE not resolving correct package.json
    'react/jsx-curly-newline': 'off' // conflicts with prettier
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js'),
      },
    },
  },
};
