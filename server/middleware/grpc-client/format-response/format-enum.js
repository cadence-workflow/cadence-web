// Copyright (c) 2022-2025 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const lowerCase = require('lodash.lowercase');
const snakeCase = require('lodash.snakecase');
const startCase = require('lodash.startcase');
const { combine } = require('../../../helpers');

const convertToUpper = value => value.toUpperCase();

const upperSnakeCase = combine(snakeCase, convertToUpper);

const removeWhiteSpace = value => value.replace(/\s/g, '');

const pascalCase = combine(lowerCase, startCase, removeWhiteSpace);

const caseFormatterMap = {
  snake: upperSnakeCase,
  pascal: pascalCase,
};

const formatEnum = (value, prefix, caseFormat = 'snake') => {
  if (!value || value.includes('INVALID')) {
    return null;
  }

  const valueRemovedPrefix = value.replace(`${prefix}_`, '');
  const caseFormatter = caseFormatterMap[caseFormat];

  return caseFormatter(valueRemovedPrefix);
};

module.exports = formatEnum;
