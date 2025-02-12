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
  DOMAIN_RESET_STATE,
  DOMAIN_SET_DOMAIN,
  DOMAIN_SET_ERROR,
} from './mutation-types';

const mutations = {
  [DOMAIN_RESET_STATE]: (state, domainName) => {
    state.domain.domainHash = {
      ...state.domain.domainHash,
      [domainName]: {},
    };
  },
  [DOMAIN_SET_DOMAIN]: (state, domain) => {
    const {
      domainInfo: { name: domainName },
      isGlobalDomain,
      replicationConfiguration: { activeClusterName },
    } = domain;

    if (isGlobalDomain) {
      return (state.domain.domainHash = {
        ...state.domain.domainHash,
        [domainName]: {
          global: domain,
        },
      });
    }

    if (!state.domain.domainHash[domainName].local) {
      return (state.domain.domainHash = {
        ...state.domain.domainHash,
        [domainName]: {
          local: [domain],
        },
      });
    }

    const matchIndex = state.domain.domainHash[domainName].local.findIndex(
      ({
        replicationConfiguration: { activeClusterName: matchActiveClusterName },
      }) => matchActiveClusterName === activeClusterName
    );

    if (matchIndex === -1) {
      return (state.domain.domainHash = {
        ...state.domain.domainHash,
        [domainName]: {
          local: [...state.domain.domainHash[domainName].local, domain],
        },
      });
    }

    state.domain.domainHash[domainName].local.splice(matchIndex, 1, domain);

    state.domain.domainHash = {
      ...state.domain.domainHash,
      [domainName]: {
        local: [...state.domain.domainHash[domainName].local],
      },
    };
  },
  [DOMAIN_SET_ERROR]: (state, { domainName, error }) => {
    state.domain.domainHash = {
      ...state.domain.domainHash,
      [domainName]: {
        error,
      },
    };
  },
};

export default mutations;
