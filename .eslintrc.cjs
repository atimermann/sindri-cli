module.exports = {
  env: {
    browser: false,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
  }
}
