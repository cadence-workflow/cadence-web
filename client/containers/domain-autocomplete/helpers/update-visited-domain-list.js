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

import { VISITED_DOMAIN_LIST_LIMIT } from '../constants';

const updateVisitedDomainList = ({ value, visitedDomainList }) => {
  const name = value.domainInfo.name;
  const uuid = value.domainInfo.uuid || null;

  const matchedDomainIndex = visitedDomainList.findIndex(
    domain =>
      domain.domainInfo.uuid === uuid ||
      ((!uuid || !domain.domainInfo.uuid) && domain.domainInfo.name === name)
  );

  if (matchedDomainIndex === -1) {
    const visitedDomainListExceededLimit =
      visitedDomainList.length - VISITED_DOMAIN_LIST_LIMIT + 1;

    return [
      ...(visitedDomainListExceededLimit >= 1
        ? visitedDomainList.slice(visitedDomainListExceededLimit)
        : visitedDomainList),
      value,
    ];
  }

  return [
    ...visitedDomainList.slice(0, matchedDomainIndex),
    ...visitedDomainList.slice(matchedDomainIndex + 1),
    value,
  ];
};

export default updateVisitedDomainList;
