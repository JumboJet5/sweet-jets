module.exports = {
  env: {
    browser: true,
    es2021: true,
    amd: true,
    node: true,
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/explicit-module-boundary-types': ['error'],
    '@typescript-eslint/no-non-null-assertion': ['error'],
    '@typescript-eslint/no-explicit-any': ['error'],
    curly: ['error', 'all'],
    'prettier/prettier': ['error'],
  },
}
