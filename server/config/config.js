// Copyright (c) 2024-2025 Uber Technologies Inc.
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
  PEERS_DEFAULT,
  REQUEST_RETRY_FLAGS_DEFAULT,
  REQUEST_RETRY_LIMIT_DEFAULT,
  REQUEST_TIMEOUT_DEFAULT,
  SERVICE_NAME_DEFAULT,
  TRANSPORT_CLIENT_TYPE_DEFAULT,
} = require('../constants');

module.exports = {
  peers: process.env.CADENCE_TCHANNEL_PEERS || PEERS_DEFAULT,
  transportClientType:
    process.env.TRANSPORT_CLIENT_TYPE || TRANSPORT_CLIENT_TYPE_DEFAULT,
  useWebpack: process.env.NODE_ENV !== 'production',
  enableAuth: process.env.ENABLE_AUTH === 'true',
  authType: process.env.AUTH_TYPE,
  authAdminJwtPrivateKey: process.env.AUTH_ADMIN_JWT_PRIVATE_KEY,
  requestConfig: {
    retryFlags: REQUEST_RETRY_FLAGS_DEFAULT,
    retryLimit:
      process.env.CADENCE_TCHANNEL_RETRY_LIMIT || REQUEST_RETRY_LIMIT_DEFAULT,
    serviceName: process.env.CADENCE_TCHANNEL_SERVICE || SERVICE_NAME_DEFAULT,
    timeout: REQUEST_TIMEOUT_DEFAULT,
  },
};
