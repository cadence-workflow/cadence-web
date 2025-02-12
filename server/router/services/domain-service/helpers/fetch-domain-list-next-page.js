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

const {
  DOMAIN_LIST_DELAY_MS,
  DOMAIN_LIST_PAGE_SIZE,
  DOMAIN_LIST_RETRY_MAX,
} = require('../constants');
const { delay } = require('../../../helpers');

const fetchDomainListNextPage = async ({
  ctx,
  delayTime = DOMAIN_LIST_DELAY_MS,
  domainList = [],
  nextPageToken,
  pageSize = DOMAIN_LIST_PAGE_SIZE,
  retryCount = 0,
}) => {
  let data;

  if (retryCount >= DOMAIN_LIST_RETRY_MAX) {
    return domainList;
  }

  try {
    data = await ctx.cadence.listDomains({
      pageSize,
      nextPageToken,
    });
  } catch (error) {
    console.log(
      `fetchDomainListNextPage retry: ${retryCount} error: ${(error &&
        error.message) ||
        error}`
    );

    await delay(delayTime);

    return fetchDomainListNextPage({
      ctx,
      delayTime,
      nextPageToken,
      domainList,
      pageSize,
      retryCount: retryCount + 1,
    });
  }

  domainList.splice(domainList.length, 0, ...data.domains);

  if (!data.nextPageToken) {
    return domainList;
  }

  await delay(delayTime);

  return fetchDomainListNextPage({
    ctx,
    delayTime,
    nextPageToken: data.nextPageToken,
    domainList,
    pageSize,
  });
};

module.exports = fetchDomainListNextPage;
