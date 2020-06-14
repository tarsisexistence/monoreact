module.exports = {
  plugins: ['@typescript-eslint', 'prettier', 'promise', 'sonarjs'],
  extends: [
    'eslint:recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:sonarjs/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    semi: [2, 'always'],
    quotes: 0,
    'consistent-return': 0,
    'promise/valid-params': 0,
    'no-useless-catch': 0,
    'sonarjs/no-useless-catch': 0,
    'sonarjs/cognitive-complexity': 0,
    'sonarjs/no-duplicated-branches': 0,
    'spaced-comment': 0,
    'no-empty-function': 2,
    'no-useless-constructor': 0,
    'lines-between-class-members': 2,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-unused-expressions': 0
  },
  env: {
    browser: true,
    node: true,
    jest: true
  }
};
