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

import { get } from 'lodash-es';
import {
  DOMAIN_AUTOCOMPLETE_COMBINED_DOMAIN_LIST,
  DOMAIN_AUTOCOMPLETE_DOMAIN_LIST,
  DOMAIN_AUTOCOMPLETE_FILTERED_VISITED_DOMAIN_LIST,
  DOMAIN_AUTOCOMPLETE_IS_LOADING,
  DOMAIN_AUTOCOMPLETE_NAVIGATE_TO_DOMAIN_URL,
  DOMAIN_AUTOCOMPLETE_SEARCH,
  DOMAIN_AUTOCOMPLETE_SEARCH_URL,
  DOMAIN_AUTOCOMPLETE_VISITED_DOMAIN_LIST,
} from './getter-types';
import {
  combineDomainList,
  filterVisitedDomainList,
  filterTopDomainList,
  formatDomainList,
  sortDomainList,
  statePrefix,
} from './helpers';
import { combine } from '~helpers';

const getters = {
  [DOMAIN_AUTOCOMPLETE_COMBINED_DOMAIN_LIST]: (_, getters) => {
    const visitedDomainList =
      getters[DOMAIN_AUTOCOMPLETE_FILTERED_VISITED_DOMAIN_LIST];
    const domainList = getters[DOMAIN_AUTOCOMPLETE_DOMAIN_LIST];
    const combinedDomainList = combineDomainList({
      visitedDomainList,
      domainList,
    });

    return combine(
      sortDomainList,
      filterTopDomainList,
      formatDomainList
    )(combinedDomainList);
  },
  [DOMAIN_AUTOCOMPLETE_DOMAIN_LIST]: state =>
    sortDomainList(get(state, statePrefix('domainList')) || []),
  [DOMAIN_AUTOCOMPLETE_FILTERED_VISITED_DOMAIN_LIST]: (_, getters) =>
    filterVisitedDomainList({
      visitedDomainList: getters[DOMAIN_AUTOCOMPLETE_VISITED_DOMAIN_LIST],
      search: getters[DOMAIN_AUTOCOMPLETE_SEARCH],
    }),
  [DOMAIN_AUTOCOMPLETE_IS_LOADING]: state =>
    get(state, statePrefix('isLoading')) || false,
  [DOMAIN_AUTOCOMPLETE_NAVIGATE_TO_DOMAIN_URL]: (_, getters) => {
    const search = getters[DOMAIN_AUTOCOMPLETE_SEARCH];

    if (!search) {
      return '';
    }

    return `/domains/${search}`;
  },
  [DOMAIN_AUTOCOMPLETE_SEARCH]: state =>
    get(state, statePrefix('search')) || '',
  [DOMAIN_AUTOCOMPLETE_SEARCH_URL]: (_, getters) =>
    `/api/domains?querystring=${getters[DOMAIN_AUTOCOMPLETE_SEARCH]}`,
  [DOMAIN_AUTOCOMPLETE_VISITED_DOMAIN_LIST]: state =>
    sortDomainList(get(state, statePrefix('visitedDomainList')) || []),
};

export default getters;
