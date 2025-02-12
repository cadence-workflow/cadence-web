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

import {
  DOMAIN_AUTOCOMPLETE_ON_MOUNTED,
  DOMAIN_AUTOCOMPLETE_SET_DOMAIN_LIST,
  DOMAIN_AUTOCOMPLETE_SET_IS_LOADING,
  DOMAIN_AUTOCOMPLETE_SET_SEARCH,
  DOMAIN_AUTOCOMPLETE_SET_VISITED_DOMAIN_LIST,
} from './mutation-types';

const mutations = {
  [DOMAIN_AUTOCOMPLETE_ON_MOUNTED]: state => {
    state.domainAutocomplete.isLoading = false;
    state.domainAutocomplete.domainList = [];
    state.domainAutocomplete.search = '';
  },
  [DOMAIN_AUTOCOMPLETE_SET_DOMAIN_LIST]: (state, payload) => {
    state.domainAutocomplete.domainList = payload;
  },
  [DOMAIN_AUTOCOMPLETE_SET_IS_LOADING]: (state, payload) => {
    state.domainAutocomplete.isLoading = payload;
  },
  [DOMAIN_AUTOCOMPLETE_SET_VISITED_DOMAIN_LIST]: (state, payload) => {
    state.domainAutocomplete.visitedDomainList = payload;
  },
  [DOMAIN_AUTOCOMPLETE_SET_SEARCH]: (state, payload) => {
    state.domainAutocomplete.search = payload;
  },
};

export default mutations;
