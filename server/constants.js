// Copyright (c) 2021-2022 Uber Technologies Inc.
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

const PEERS_DEFAULT = '127.0.0.1:5435';
// const PEERS_DEFAULT = '127.0.0.1:7933';

const REQUEST_RETRY_FLAGS_DEFAULT = { onConnectionError: true };

const REQUEST_RETRY_LIMIT_DEFAULT = 3;

const REQUEST_TIMEOUT_DEFAULT = 1000 * 60 * 5;

const SERVICE_NAME_DEFAULT = 'cadence-frontend-staging';
// const SERVICE_NAME_DEFAULT = 'cadence-frontend';

const TRANSPORT_CLIENT_TYPE_DEFAULT = 'grpc';  // 'tchannel', 'grpc'
// const TRANSPORT_CLIENT_TYPE_DEFAULT = 'tchannel';  // 'tchannel', 'grpc'

module.exports = {
  PEERS_DEFAULT,
  REQUEST_RETRY_FLAGS_DEFAULT,
  REQUEST_RETRY_LIMIT_DEFAULT,
  REQUEST_TIMEOUT_DEFAULT,
  SERVICE_NAME_DEFAULT,
  TRANSPORT_CLIENT_TYPE_DEFAULT,
};
