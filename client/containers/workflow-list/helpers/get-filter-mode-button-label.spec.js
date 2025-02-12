// Copyright (c) 2021-2025 Uber Technologies Inc.
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

import { FILTER_MODE_ADVANCED, FILTER_MODE_BASIC } from '../constants';
import getFilterModeButtonLabel from './get-filter-mode-button-label';

describe('getFilterModeButtonLabel', () => {
  describe('when called with "filterMode" = FILTER_MODE_ADVANCED', () => {
    const filterMode = FILTER_MODE_ADVANCED;

    it('should return FILTER_MODE_BASIC.', () => {
      const output = getFilterModeButtonLabel(filterMode);

      expect(output).toEqual(FILTER_MODE_BASIC);
    });
  });

  describe('when called with "filterMode" = FILTER_MODE_BASIC', () => {
    const filterMode = FILTER_MODE_BASIC;

    it('should return FILTER_MODE_ADVANCED.', () => {
      const output = getFilterModeButtonLabel(filterMode);

      expect(output).toEqual(FILTER_MODE_ADVANCED);
    });
  });

  describe('when called with "filterMode" = undefined', () => {
    const filterMode = undefined;

    it('should return FILTER_MODE_ADVANCED.', () => {
      const output = getFilterModeButtonLabel(filterMode);

      expect(output).toEqual(FILTER_MODE_ADVANCED);
    });
  });
});
