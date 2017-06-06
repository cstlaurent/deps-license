module.exports = {
  extends: ['standard', 'plugin:jest/recommended'],
  env: {
    node: true,
    'jest/globals': true
  },
  parserOptions: {
    ecmaVersion: 8
  },
  plugins: ['jest']
}