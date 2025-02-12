<script>
// Copyright (c) 2017-2025 Uber Technologies Inc.
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

import { getKeyValuePairs, mapDomainDescription } from '~helpers';
import { DetailList } from '~components';
import { httpService } from '~services';

export default {
  data() {
    return {
      error: undefined,
      loading: true,
      domainConfig: undefined,
    };
  },
  props: ['clusterName', 'domain'],
  components: {
    'detail-list': DetailList,
  },
  created() {
    const { clusterName } = this;

    httpService
      .get(`/api/domains/${this.domain}`)
      .then(
        r => {
          const domainConfig = mapDomainDescription(r);
          const kvps = getKeyValuePairs({ clusterName, item: domainConfig });

          this.domainConfig = { ...domainConfig, kvps };
        },
        res => {
          this.error = `${res.statusText || res.message} ${res.status}`;
        }
      )
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {},
};
</script>

<template>
  <section class="domain-settings domain-description" :class="{ loading }">
    <header>
      <h3>{{ domain }}</h3>
    </header>
    <detail-list
      v-if="domainConfig"
      :item="domainConfig"
      :title="`Domain ${domain} Configuration`"
    />
    <span class="error" v-if="error">{{ error }}</span>
  </section>
</template>

<style lang="stylus">
@require "../../styles/definitions.styl"

section.domain-settings.domain-description {
  flex: 1 1 60%;
  padding: layout-spacing-small;

  &.pending dl.details {
    opacity: 0.2;
  }

  span.domain-name {
    display: inline-block;
    font-size: 18px;
    padding: inline-spacing-small;
    font-family: monospace-font-family;
  }

  dl.details {
    & > div {
      display: block;
      padding: inline-spacing-small;
    }

    dt, dd {
      line-height: 1.5em;
    }

    dt {
      text-transform: uppercase;
      font-family: primary-font-family;
      font-weight: 200;
    }
  }
}
</style>
