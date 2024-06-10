// Copyright (c) 2022-2024 Uber Technologies Inc.
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

import { lowerCase, snakeCase, startCase, flowRight } from 'lodash';

const convertToUpper = (value: string) => value.toUpperCase();

const upperSnakeCase = flowRight([snakeCase, convertToUpper]);

const removeWhiteSpace = (value: string) => value.replace(/\s/g, '');

const pascalCase = flowRight([lowerCase, startCase, removeWhiteSpace]);

const caseFormatterMap = {
  snake: upperSnakeCase,
  pascal: pascalCase,
} as const;

const formatEnum = (
  value: string,
  prefix?: string,
  caseFormat: keyof typeof caseFormatterMap = 'snake'
) => {
  if (!value || value.includes('INVALID')) {
    return null;
  }
  const valueRemovedPrefix = prefix
    ? value.replace(new RegExp(`^${prefix}_`), '')
    : value;
  const caseFormatter = caseFormatterMap[caseFormat];

  return caseFormatter(valueRemovedPrefix);
};

export default formatEnum;
