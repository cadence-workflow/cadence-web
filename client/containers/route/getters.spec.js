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

import { ROUTE_PARAMS, ROUTE_PARAMS_DOMAIN, ROUTE_QUERY } from './getter-types';
import getterFns from './getters';
import { initGetters } from '~test';

describe('route getters', () => {
  describe('calling getters[ROUTE_PARAMS]', () => {
    describe('and state.route.params is defined', () => {
      const state = {
        route: {
          params: {
            paramA: 'valueA',
            paramB: 'valueB',
          },
        },
      };

      it('should return the value from state.route.params', () => {
        const getters = initGetters({ getterFns, state });
        const output = getters[ROUTE_PARAMS];

        expect(output.paramA).toEqual('valueA');
        expect(output.paramB).toEqual('valueB');
      });
    });

    describe('and state.route.params is not defined', () => {
      const state = {
        route: {},
      };

      it('should return an empty object.', () => {
        const getters = initGetters({ getterFns, state });
        const output = getters[ROUTE_PARAMS];

        expect(output).toEqual({});
      });
    });
  });

  describe('calling getters[ROUTE_PARAMS_DOMAIN]', () => {
    describe('and state.route.params.domain is defined', () => {
      const state = {
        route: {
          params: {
            domain: 'domainA',
          },
        },
      };

      it('should return the value from state.route.params.domain', () => {
        const getters = initGetters({ getterFns, state });
        const output = getters[ROUTE_PARAMS_DOMAIN];

        expect(output).toEqual('domainA');
      });
    });
  });

  describe('calling getters[ROUTE_QUERY]', () => {
    describe('and state.route.query is defined', () => {
      const state = {
        route: {
          query: {
            queryA: 'valueA',
            queryB: 'valueB',
          },
        },
      };

      it('should return the value from state.route.query', () => {
        const getters = initGetters({ getterFns, state });
        const output = getters[ROUTE_QUERY];

        expect(output.queryA).toEqual('valueA');
        expect(output.queryB).toEqual('valueB');
      });
    });

    describe('and state.route.query is not defined', () => {
      const state = {
        route: {},
      };

      it('should return an empty object.', () => {
        const getters = initGetters({ getterFns, state });
        const output = getters[ROUTE_QUERY];

        expect(output).toEqual({});
      });
    });
  });
});
