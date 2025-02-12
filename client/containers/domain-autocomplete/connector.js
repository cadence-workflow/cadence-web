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

import { connect } from 'vuex-connect';
import { ROUTE_PARAMS_DOMAIN } from '../route/getter-types';
import {
  DOMAIN_AUTOCOMPLETE_ON_CHANGE,
  DOMAIN_AUTOCOMPLETE_ON_SEARCH,
} from './action-types';
import {
  DOMAIN_AUTOCOMPLETE_COMBINED_DOMAIN_LIST,
  DOMAIN_AUTOCOMPLETE_IS_LOADING,
  DOMAIN_AUTOCOMPLETE_NAVIGATE_TO_DOMAIN_URL,
  DOMAIN_AUTOCOMPLETE_SEARCH,
} from './getter-types';
import { DOMAIN_AUTOCOMPLETE_ON_MOUNTED } from './mutation-types';

const actionsToEvents = {
  onChange: DOMAIN_AUTOCOMPLETE_ON_CHANGE,
  onSearch: DOMAIN_AUTOCOMPLETE_ON_SEARCH,
};

const gettersToProps = {
  isLoading: DOMAIN_AUTOCOMPLETE_IS_LOADING,
  domain: ROUTE_PARAMS_DOMAIN,
  domainList: DOMAIN_AUTOCOMPLETE_COMBINED_DOMAIN_LIST,
  navigateToDomainUrl: DOMAIN_AUTOCOMPLETE_NAVIGATE_TO_DOMAIN_URL,
  search: DOMAIN_AUTOCOMPLETE_SEARCH,
};

const lifecycle = {
  mounted: ({ commit }) => {
    commit(DOMAIN_AUTOCOMPLETE_ON_MOUNTED);
  },
};

export default connect({
  actionsToEvents,
  gettersToProps,
  lifecycle,
});
