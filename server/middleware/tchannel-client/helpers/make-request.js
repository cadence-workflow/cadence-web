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

const formatBody = require('./format-body');
const formatMethod = require('./format-method');
const formatRequestName = require('./format-request-name');
const uiTransform = require('./ui-transform');
const withNextPageTokenBodyTransform = require('./with-next-page-token-body-transform');

const makeRequest = ({ authTokenHeaders, channels, ctx, requestConfig }) => ({
  bodyTransform = withNextPageTokenBodyTransform,
  channelName = 'cadence',
  method,
  requestName,
  responseTransform = uiTransform,
  serviceName = 'WorkflowService',
}) => body =>
  new Promise((resolve, reject) => {
    try {
      channels[channelName].request(requestConfig).send(
        formatMethod({ method, serviceName }),
        {
          ...authTokenHeaders,
        },
        {
          [formatRequestName(requestName)]: formatBody({
            body,
            bodyTransform,
          }),
        },
        (error, response) => {
          try {
            if (error) {
              reject(error);
            } else if (response.ok) {
              resolve(responseTransform(response.body));
            } else {
              ctx.throw(
                response.typeName === 'entityNotExistError' ? 404 : 400,
                null,
                response.body || response
              );
            }
          } catch (error) {
            reject(error);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });

module.exports = makeRequest;
