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

import { ROUTE_PARAMS_DOMAIN } from '../route/getter-types';
import {
  CROSS_REGION,
  CROSS_REGION_CLUSTER_ORIGIN_LIST,
} from '../cross-region/getter-types';
import { DOMAIN_HASH, DOMAIN_IS_READY } from '../domain/getter-types';
import activeStatusGetterFns from './getters';
import { ACTIVE_STATUS_CLUSTER_LIST } from './getter-types';
import { initGetters } from '~test';

describe('Active status getters', () => {
  describe('when calling getters[ACTIVE_STATUS_CLUSTER_LIST]', () => {
    it('should return empty array if its dynamic dependent getters returned Nil', () => {
      const dependentGetterNames = [
        CROSS_REGION_CLUSTER_ORIGIN_LIST,
        CROSS_REGION,
        ROUTE_PARAMS_DOMAIN,
      ];

      dependentGetterNames.forEach(getterName => {
        const getterFns = {
          ...activeStatusGetterFns,
          [getterName]: () => null,
          [DOMAIN_IS_READY]: () => true,
          [DOMAIN_HASH]: () => ({}),
        };
        const getters = initGetters({ getterFns });
        const output = getters[ACTIVE_STATUS_CLUSTER_LIST];

        expect(output).toEqual([]);
      });
    });
  });
});
