const currentYear = (new Date()).getFullYear();

module.exports = {
  extends: [
    'plugin:prettier/recommended',
    'plugin:vue/essential',
  ],
  env: {
    'jest/globals': true,
    'node': true,
  },
  globals: {
    module: true,   // hot reloading
    scenario: true, // mocha
    should: true,   // mocha
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['jest', 'import', 'eslint-plugin-header'],
  rules: {
    curly: ['error', 'all'],
    'dot-notation': 'error',
    'header/header': [
      'error',
      'line',
      [
        {
          /**
           * Examples which match pattern:
           *
           * 1. single year span (by default for new files)
           * // Copyright (c) 2025 Uber Technologies Inc.
           *
           * 2. multi-year span
           * // Copyright (c) 2017-2025 Uber Technologies Inc.
           *
           * 3. new file from another company referenced
           * // Modifications Copyright (c) 2025 Uber Technologies Inc.
           *
           * See `client/test/lint/license` for passing examples.
           *
           * NOTE: This will update each year so when new year's day comes,
           *       the build will fail and will need the headers to be updated.
           *       Just be aware of running auto-fix as it will use what is in
           *       the template and not update the offending part of the header.
           *
           *       In this case it will change header:
           *         from:
           *           Copyright (c) 2017-2023 Uber Technologies Inc.
           *           Copyright (c) 2020 Uber Technologies Inc.
           *         to:
           *           Copyright (c) 2025 Uber Technologies Inc.
           *         but should be (respectively):
           *           Copyright (c) 2017-2025 Uber Technologies Inc.
           *           Copyright (c) 2020-2025 Uber Technologies Inc.
           *
           *       I have requested for a new feature which allows templates to
           *       use named capture groups in the template. See open issue:
           *       https://github.com/Stuk/eslint-plugin-header/issues/33
           */
          pattern: ` (Modifications )?Copyright \\(c\\) (?<firstYear>20\\d{2}\\-)?${currentYear} Uber Technologies Inc\.`,
          template: ` Copyright (c) ${currentYear} Uber Technologies Inc.`,
        },
        {
          /**
           * This pattern can match anything as we don't know who we are referencing.
           * By default if no comment is specified this line will be ignored (inserts blank line).
           *
           * 1. Empty space
           * //
           *
           * 2. new file from another company referenced
           * // Copyright (c) 2020 Temporal Technologies, Inc.
           *
           * 3. existing file but updated from another company and merged back
           * // Portions of the Software are attributed to Copyright (c) 2020 Temporal Technologies Inc.
           *
           * See `client/test/lint/license` for passing examples.
           */
          pattern: '',
          template: ' ',
        },
        '',
        ' Permission is hereby granted, free of charge, to any person obtaining a copy',
        ' of this software and associated documentation files (the "Software"), to deal',
        ' in the Software without restriction, including without limitation the rights',
        ' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell',
        ' copies of the Software, and to permit persons to whom the Software is',
        ' furnished to do so, subject to the following conditions:',
        '',
        ' The above copyright notice and this permission notice shall be included in',
        ' all copies or substantial portions of the Software.',
        '',
        ' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR',
        ' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,',
        ' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE',
        ' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER',
        ' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,',
        ' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN',
        ' THE SOFTWARE.'
      ],
      2
    ],
    'import/order': [
      'error',
      { 'groups': ['builtin', 'external', 'parent', 'sibling', 'index'] }
    ],
    'jest/consistent-test-it': [
      'error',
      { 'fn': 'test', 'withinDescribe': 'it' }
    ],
    'jest/lowercase-name': [
      'error',
      {
        'ignore': ['describe', 'test']
      }
    ],
    'no-var': 'error',
    'no-use-before-define': 'error',
    'no-useless-constructor': 'error',
    'object-curly-spacing': ['error', 'always'],
    'padding-line-between-statements': [
      'error',
      { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
      { 'blankLine': 'always', 'prev': ['const', 'let', 'var'], 'next': '*' },
      {
        'blankLine': 'any',
        'prev': ['const', 'let', 'var'],
        'next': ['const', 'let', 'var']
      },
      { 'blankLine': 'always', 'prev': 'directive', 'next': '*' },
      { 'blankLine': 'any', 'prev': 'directive', 'next': 'directive' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'if' },
      { 'blankLine': 'always', 'prev': 'if', 'next': '*' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'function' }
    ],
    'prefer-const': 'error',
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: true,
        singleQuote: true,
        trailingComma: 'es5',
        jsxBracketSameLine: false
      },
    ],
    'space-before-blocks': 'error',
    'vue/component-tags-order': [
      'error',
      {
        'order': ['script', 'template', 'style'],
      }
    ],
    'vue/multi-word-component-names': 'off',
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
};
