// Copyright (c) 2020-2025 Uber Technologies Inc.
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

import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import { sync } from 'vuex-router-sync';
import {
  // active status
  activeStatusActions,
  activeStatusGetters,

  // cluster
  clusterActions,
  getClusterDefaultState,
  clusterGetters,
  clusterMutations,

  // cross region
  crossRegionActions,
  getCrossRegionDefaultState,
  crossRegionGetters,
  crossRegionMutations,

  // domain
  domainActions,
  getDomainDefaultState,
  domainGetters,
  domainMutations,

  // domain autocomplete
  domainAutocompleteActions,
  getDomainAutocompleteDefaultState,
  domainAutocompleteGetters,
  domainAutocompleteMutations,
  domainAutocompleteReducer,

  // graph
  getGraphDefaultState,
  graphGetters,
  graphMutations,

  // route
  routeActionCreator,
  routeGetters,

  // settings
  getSettingsWorkflowHistoryDefaultState,
  settingsWorkflowHistoryGetters,
  settingsWorkflowHistoryMutations,

  // workflow
  getWorkflowDefaultState,
  workflowGetters,
  workflowMutations,

  // workflow list
  workflowListActions,
  workflowListGetters,

  // workflow history
  getWorkflowHistoryDefaultState,

  // workflow pending
  workflowPendingActions,
  workflowPendingGetters,
} from '~containers';

const getDefaultState = (state = {}) => ({
  cluster: getClusterDefaultState(state.cluster),
  crossRegion: getCrossRegionDefaultState(state.crossRegion),
  domain: getDomainDefaultState(state.domain),
  domainAutocomplete: getDomainAutocompleteDefaultState(
    state.domainAutocomplete
  ),
  graph: getGraphDefaultState(state.graph),
  settingsWorkflowHistory: getSettingsWorkflowHistoryDefaultState(
    state.settingsWorkflowHistory
  ),
  workflow: getWorkflowDefaultState(state.workflow),
  workflowHistory: getWorkflowHistoryDefaultState(state.workflowHistory),
});

const getStoreConfig = ({ router, state }) => {
  const initialState = getDefaultState(state);

  const vuexLocal = new VuexPersistence({
    restoreState: key => {
      const state = JSON.tryParse(localStorage.getItem(key));

      if (!state) {
        return;
      }

      // ensures these states do not persist to local storage.
      const crossRegion = getCrossRegionDefaultState();
      const domain = getDomainDefaultState();

      const domainAutocomplete = domainAutocompleteReducer(
        state.domainAutocomplete
      );

      return {
        ...state,
        crossRegion,
        domain,
        ...(domainAutocomplete && {
          domainAutocomplete,
        }),
      };
    },
    storage: window.localStorage,
  });

  const storeConfig = {
    actions: {
      ...activeStatusActions,
      ...clusterActions,
      ...crossRegionActions,
      ...domainActions,
      ...domainAutocompleteActions,
      ...routeActionCreator(router),
      ...workflowListActions,
      ...workflowPendingActions,
    },
    getters: {
      ...activeStatusGetters,
      ...clusterGetters,
      ...crossRegionGetters,
      ...domainGetters,
      ...domainAutocompleteGetters,
      ...graphGetters,
      ...routeGetters,
      ...settingsWorkflowHistoryGetters,
      ...workflowGetters,
      ...workflowListGetters,
      ...workflowPendingGetters,
    },
    mutations: {
      ...clusterMutations,
      ...crossRegionMutations,
      ...domainMutations,
      ...domainAutocompleteMutations,
      ...graphMutations,
      ...settingsWorkflowHistoryMutations,
      ...workflowMutations,
    },
    plugins: [vuexLocal.plugin],
    state: initialState,
  };

  return storeConfig;
};

const initStore = ({ router, state }) => {
  Vue.use(Vuex);

  const storeConfig = getStoreConfig({ router, state });
  const store = new Vuex.Store(storeConfig);

  sync(store, router);

  return store;
};

export default initStore;
