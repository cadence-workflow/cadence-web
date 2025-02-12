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

const path = require('path');
const isIPv4 = require('is-ipv4-node');
const TChannelAsThrift = require('tchannel/as/thrift');
const lookupAsync = require('./lookup-async');

const makeChannels = async ({ client, peers }) => {
  const peerList = peers.split(',');

  const ipPeers = await Promise.all(
    peerList.map(peer => {
      const [host, port] = peer.split(':');

      if (!isIPv4(host)) {
        return lookupAsync(host).then(ip => [ip, port].join(':'));
      } else {
        return peer;
      }
    })
  );

  const cadenceChannel = client.makeSubChannel({
    serviceName: 'cadence-frontend',
    peers: ipPeers,
    requestDefaults: {
      hasNoParent: true,
      headers: { as: 'raw', cn: 'cadence-web' },
    },
  });

  const adminTChannelAsThrift = TChannelAsThrift({
    channel: cadenceChannel,
    entryPoint: path.join(__dirname, '../../../idl/thrift/admin.thrift'),
  });

  const cadenceTChannelAsThrift = TChannelAsThrift({
    channel: cadenceChannel,
    entryPoint: path.join(__dirname, '../../../idl/thrift/cadence.thrift'),
  });

  return {
    admin: adminTChannelAsThrift,
    cadence: cadenceTChannelAsThrift,
  };
};

module.exports = makeChannels;
